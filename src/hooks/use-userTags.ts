"use client"

import { useDispatch } from "react-redux";
import { addTag, editColor, UserTags, removeTag, setUserId, setWholeTags, Tag } from "../../redux/slices/tags/tagsSlice";
import { AppDispatch } from "../../redux/store";
import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import {  doc, onSnapshot } from "firebase/firestore";
import { createUserTag, deleteUserTag, editUserTag } from "@/actions/tags";

/**
 * Arguments for the useUserTags hook.
 */
interface UseUserTagsArgs {
  initialUserTags: UserTags,
  setDeletedUserTag: (tag: Tag) => void;
}

/**
 * Custom hook to manage user tags.
 * 
 * Handles fetching tags from Firestore, syncing with Redux, and providing
 * handlers for creating, deleting, and editing tags with optimistic updates.
 * 
 * @param {UseUserTagsArgs} data - Initial tags and a setter for deleted tags.
 * @returns {Object} Handlers for tag operations.
 */
export function useUserTags(data: UseUserTagsArgs) {

  const {initialUserTags, setDeletedUserTag} = data;

  const dispatch = useDispatch<AppDispatch>();
  const [user, loading] = useAuthState(auth);
  // This will ensure, that we will not load the userTags uneccessarily since 
  // we are getting it from the server action already on mount
  const firstCall = useRef(true);

  useEffect(() => {
      // Fill the redux state on mount
      dispatch(setWholeTags(initialUserTags.tags));
      if (!initialUserTags.userId) return;
      dispatch(setUserId(initialUserTags.userId));
  }, [])

  useEffect(() => {

    if (loading || !user) return;

    const ref = doc(db, "userTags", user.uid);

    // This will automatically fetch the latest data, so we always have the
    // correct values.
    const unsubscribe = onSnapshot(ref, (snap) => {

      // Ignore first iteration to not load data unnecessarily
      if (firstCall.current) {
        firstCall.current = false;
        return;
      }
    
      if (!snap.exists()) {
        dispatch(setWholeTags([]));
        return;
      }

      const data = snap.data();
      dispatch(setWholeTags(data?.tags ?? []))
     
    },
      (err) => {
        console.error("An error occurred while catching userTags:", err);
      })

      return () => unsubscribe();
  }, [user, loading])  

  /**
   * Creates a new user tag.
   * 
   * Optimistically adds the tag to Redux, then saves it to the server.
   * 
   * @param {Tag} tag - The tag to create.
   */
  const handleCreateUserTag = async (tag: Tag) => {

    // The user receives immediate feedback
    dispatch(addTag(tag));

    try {
      await createUserTag(tag);
    } catch (err) {
      console.error("An error occurred while creating userTag:", err);
    }
  }

  /**
   * Deletes a user tag.
   * 
   * Optimistically removes the tag from Redux and updates the deleted tag state,
   * then deletes it from the server.
   * 
   * @param {Tag} tag - The tag to delete.
   */
   const handleDeleteUserTag = async (tag: Tag) => {

    // The user receives immediate feedback
    dispatch(removeTag(tag));
    setDeletedUserTag(tag);

    try {
      await deleteUserTag(tag);
    } catch (err) {
      console.error("An error occurred while deleting userTag:", err);
    }
  }

  /**
   * Edits the color of a user tag.
   * 
   * Optimistically updates the tag color in Redux, then updates it on the server.
   * 
   * @param {Tag} tag - The tag to edit.
   * @param {string} tagColor - The new color for the tag.
   */
  const handleEditUserTag = async (tag: Tag, tagColor: string) => {

    dispatch(editColor({ tagName: tag.name, newColor: tagColor }));

    try {
      await editUserTag(tag, tagColor);
    } catch (err) {
      console.error("An error occurred while editing userTag:", err);
    }
  }

  return {handleCreateUserTag, handleDeleteUserTag, handleEditUserTag}
}
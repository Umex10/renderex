"use client"

import { useDispatch } from "react-redux";
import { addTag, editColor, removeTag } from "../../redux/slices/tags/tagsSlice";
import { Tag } from "../types/tag";
import { AppDispatch } from "../../redux/store";
import { createUserTag, deleteUserTag, editUserTag } from "@/actions/tags";

/**
 * Arguments for the useUserTags hook.
 */
interface UseUserTagsArgs {
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

  const {setDeletedUserTag} = data;

  const dispatch = useDispatch<AppDispatch>();

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
"use client"

import { useDispatch } from "react-redux";
import { addGlobalTag, GlobalTags, removeGlobalTag, setUserId, setWholeArray, Tag } from "../../redux/slices/tags/tagsSlice";
import { AppDispatch } from "../../redux/store";
import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import {  doc, onSnapshot } from "firebase/firestore";
import { createGlobalTag, deleteGlobalTag } from "@/actions/tags";

interface UseGlobalTagsArgs {
  initialGlobalTags: GlobalTags,
  setDeletedGlobalTag: (globalTag: Tag) => void;
}

export function useGlobalTags(data: UseGlobalTagsArgs) {

  const {initialGlobalTags, setDeletedGlobalTag} = data;

  const dispatch = useDispatch<AppDispatch>();
  const [user, loading] = useAuthState(auth);
  // This will ensure, that we will not load the globalTags uneccessarily since 
  // we are getting it from the server action already on mount
  const firstCall = useRef(true);

  useEffect(() => {
      // Fill the redux state on mount
      dispatch(setWholeArray(initialGlobalTags.tags));
      if (!initialGlobalTags.userId) return;
      dispatch(setUserId(initialGlobalTags.userId));
  }, [])

  useEffect(() => {

    if (loading || !user) return;

    const ref = doc(db, "globalTags", user.uid);

    // This will automatically fetch the latest data, so we always have the
    // correct values.
    const unsubscribe = onSnapshot(ref, (snap) => {

      // Ignore first iteration to not load data unnecessarily
      if (firstCall.current) {
        firstCall.current = false;
        return;
      }
    
      if (!snap.exists()) {
        dispatch(setWholeArray([]));
        return;
      }

      const data = snap.data();
      dispatch(setWholeArray(data?.tags ?? []))
     
    },
      (err) => {
        console.error("Firestore error occured while catching globalTags:", err);
      })

      return () => unsubscribe();
  }, [user, loading])  

  const handleNewGlobalTag = async (globalTag: Tag) => {

    // The user receives immediate feedback
    dispatch(addGlobalTag(globalTag));

    try {
      await createGlobalTag(globalTag);
    } catch (err) {
      console.error(err);
    }
  }

   const handleRemoveGlobalTag = async (globalTag: Tag) => {

    // The user receives immediate feedback
    dispatch(removeGlobalTag(globalTag));

    setDeletedGlobalTag(globalTag);

    try {
      await deleteGlobalTag(globalTag);
    } catch (err) {
      console.error(err);
    }
  }

  return {handleNewGlobalTag, handleRemoveGlobalTag}
}
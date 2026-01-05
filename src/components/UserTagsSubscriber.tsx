"use client"

import { useDispatch } from "react-redux";
import { setUserId, setWholeTags, UserTags } from "../../redux/slices/tags/tagsSlice";
import { AppDispatch } from "../../redux/store";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
 
 interface UserTagsSubscriberArgs {
   initialUserTags: UserTags
 }

 export function UserTagsSubscriber({initialUserTags}: UserTagsSubscriberArgs) {
  const dispatch = useDispatch<AppDispatch>();
  const [user, loading] = useAuthState(auth);
  // This will ensure, that we will not load the userTags uneccessarily since 
  // we are getting it from the server action already on mount
  const firstLoad = useRef(true);

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

      // This will ensure we don't fetch the notes unnecessarily on the first load
      if (firstLoad.current) {
        firstLoad.current = false;
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

  return null;
 }
 
 
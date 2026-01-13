"use client"

import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { setLoadingNotes, setNotes } from "../../../redux/slices/notesSlice";
import { NotesArgs } from "@/types/notesArgs";

export function NotesSubscriber() {
 
  const [user, loading] = useAuthState(auth);
  const firstLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  
    useEffect(() => {
  
      if (loading || !user) return;

      dispatch(setLoadingNotes(true));
  
      // This will ensure we don't fetch the notes unnecessarily on the first load
      if (firstLoad.current) {
        firstLoad.current = false;
        dispatch(setLoadingNotes(false));
        return;
      }
  
      // Gets all notes related to the user
      const q = query(
        collection(db, "notes"),
        where("userId", "==", user.uid)
      );
  
      // Triggers fetching the current data, if something changes on firebase
      const unsubscribe = onSnapshot(q, (snap) => {
        const notesData = snap.docs.map(doc => ({
          id: doc.id, //Given by firebase
          ...(doc.data() as Omit<NotesArgs, "id">)
        }));
        dispatch(setNotes(notesData))
        dispatch(setLoadingNotes(false));
      },
        (error) => {
          console.error("Firestore error while catching all notes: ", error);
        })
  
      return () => unsubscribe()
    }, [user, loading, dispatch])

  return null; // rendert nichts, nur Hook Side Effects
}
"use client"

import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setNotes } from "../../redux/slices/notesSlice";
import { NotesArgs } from "@/types/notesArgs";


export function NotesSubscriber() {
 
  const [user, loading] = useAuthState(auth);
  const firstLoad = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  const initialNotes = useSelector((state: RootState) => state.notesState.notes);
  
    useEffect(() => {
  
      if (loading || !user) return;
  
      // This will ensure we don't fetch the notes unnecessarily on the first load
      if (firstLoad.current) {
        firstLoad.current = false;
        dispatch(setNotes(initialNotes))
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
      },
        (error) => {
          console.error("Firestore error while catching all notes: ", error);
        })
  
      return () => unsubscribe()
    }, [user, loading])

  return null; // rendert nichts, nur Hook Side Effects
}
import { NotesArgs } from "../types/notesArgs";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { createNote, deleteNote, editNote } from "@/actions/notes";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../redux/slices/notesSlice";
import { AppDispatch } from "../../redux/store";
import { Tag } from "../../redux/slices/tags/tagsSlice";

/**
 * Custom hook to manage notes state and interactions.
 * Handles real-time updates from Firestore and provides methods to create, edit, and delete notes.
 * Uses Server Actions for data mutations.
 * 
 * @param {NotesArgs[]} initialNotes - The initial list of notes to display before updates kick in.
 * @returns {Object} An object containing the notes list, loading state, and handler functions.
 * @property {NotesArgs[]} notes - The current list of notes.
 * @property {boolean} loading - The loading state of the user authentication.
 * @property {Function} handleNew - Function to handle the creation of a new note.
 * @property {Function} handleDelete - Function to handle the deletion of a note.
 * @property {Function} handleEdit - Function to handle the editing of a note.
 */
export function useNotes(initialNotes: NotesArgs[]) {

  const dispatch = useDispatch<AppDispatch>();

  const [notes, setNotes] = useState<NotesArgs[]>(initialNotes)
  const [user, loading] = useAuthState(auth);

  useEffect(() => {

    if (loading || !user) return;

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
      setNotes(notesData)
    },
      (error) => {
        console.error("Firestore error while catching all notes: ", error);
      })

    return () => unsubscribe()
  }, [user, loading])

  /**
   * Handles the deletion of a note.
   * Feedbackly updates the local state and then calls the server action.
   * 
   * @param {React.MouseEvent} e - The mouse event triggered by the delete button.
   * @param {string} noteId - The ID of the note to delete.
   */
  const handleDelete = async (e: React.MouseEvent, noteId: string) => {

    e.stopPropagation();

    // fallback array
    const oldNotes = [...notes];

    // This will give the user immediate feedback!
    setNotes(old => old.filter(note => note.id !== noteId));

    try {
      // Calling firebase
      const result = await deleteNote(noteId);

      if (!result.success) {
        setNotes(oldNotes);
      }

    } catch (err) {
      console.error("An error occured while deleting the note: ", err);
    }
  }

  /**
   * Handles the creation of a new note.
   * Feedbackly updates the local state with a temporary ID and then calls the server action.
   * Updates the note ID with the real one from the server upon success.
   * 
   * @param {Object} data - The data for the new note.
   * @param {string} data.title - The title of the new note.
   * @param {string[]} data.tags - The tags associated with the new note.
   */
  const handleNew = async (data: { title: string, tags: Tag[] }) => {

    if (!user) {
      throw new Error("User was not defined while handling new Note inside Sidebar");
    }

    // set newNote with a fake id which we will change later
    const customId = data.title + data.tags.toString();

    const newNote = {
      id: customId,
      title: data.title,
      content: "",
      date: new Date().toISOString(),
      tags: data.tags,
      userId: user.uid
    }

     // fallback array
    const oldNotes = [...notes];

     // This will give the user immediate feedback!
    setNotes(old => [...old, newNote]);

    try {
      // Calling firebase
      const result = await createNote(newNote);

      if (!result.success) {
        setNotes(oldNotes);
      }

      if (result && result.id) {

        // Change id to the id which was given by firebase 
        setNotes(old => old.map(note => 
          note.id === result.id ? {...note, id: result.id} : note
        ))
        dispatch(setActiveNote(result.id))
      }

    } catch (err) {
      console.error("An error occured while calling createNote server action: ", err);
    }
  }

  /**
   * Handles the editing of an existing note.
   * Feedbackly updates the local state and then calls the server action.
   * 
   * @param {Object} data - The updated data for the note.
   * @param {string} data.title - The updated title.
   * @param {string} data.content - The updated content.
   * @param {string[]} data.tags - The updated tags.
   * @param {string} noteId - The ID of the note to edit.
   */
  const handleEdit = async (data: { title: string, content: string, tags: Tag[] },
    noteId: string
  ) => {

    const newNote = {
      title: data.title,
      content: data.content,
      date: new Date().toISOString(),
      tags: data.tags,
    }

     // fallback array
    const oldNotes = [...notes];

     // This will give the user immediate feedback!
    setNotes(old =>
      old.map(note =>
        note.id === noteId ? { ...note, ...newNote } : note
      )
    );

    try {
      // Calling firebase
      const result = await editNote(noteId, newNote);

      if (!result.success) {
        setNotes(oldNotes);
      }

    } catch (err) {
      console.error("An error occured while calling editNote server action: ", err);
    }
  }

  return { notes, loading, handleNew, handleDelete, handleEdit };

}
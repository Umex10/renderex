"use client"

import { NotesArgs } from "../types/notesArgs";

import { createNote, deleteNote, editNote } from "@/actions/notes";
import { useDispatch } from "react-redux";
import { addNote, removeNote, setActiveNote, setNotes, changeNote } from "../../redux/slices/notesSlice";
import { AppDispatch } from "../../redux/store";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { auth } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
/**
 * Custom hook to manage notes state and interactions.
 * Handles real-time updates from Firestore and provides methods to create, edit, and delete notes.
 * Uses Server Actions for data mutations.
 * 
 * @param {NotesArgs[]} notes - The initial list of notes to display before updates kick in.
 * @returns {Object} An object containing the notes list, loading state, and handler functions.
 * @property {NotesArgs[]} notes - The current list of notes.
 * @property {boolean} loading - The loading state of the user authentication.
 * @property {Function} handleNew - Function to handle the creation of a new note.
 * @property {Function} handleDelete - Function to handle the deletion of a note.
 * @property {Function} handleEdit - Function to handle the editing of a note.
 */
export function useNotes(notes: NotesArgs[]) {

  const dispatch = useDispatch<AppDispatch>();
  const [user] = useAuthState(auth);


  // This is needed, to find the exact note we need. We can't write this function within the slice,
  // because the return statement is not suitable
  const findNote = (noteId: string) => {
    const found = notes.find(note => note.id === noteId);
    return found;
  }

  /**
   * Handles the deletion of a note.
   * Feedbackly updates the local state and then calls the server action.
   * 
   * @param {React.MouseEvent} e - The mouse event triggered by the delete button.
   * @param {string} noteId - The ID of the note to delete.
   */
  const handleDeleteNote = async (e: React.MouseEvent, noteId: string) => {

    e.stopPropagation();

    // fallback array
    const oldNotes = [...notes];

    // This will give the user immediate feedback!
    dispatch(removeNote(noteId));

    try {
      // Calling firebase
      const result = await deleteNote(noteId);

      if (!result.success) {
        dispatch(setNotes(oldNotes));
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
  const handleCreateNote = async (data: { title: string, tags: Tag[] }) => {


    // set newNote with a fake id which we will change afterwards
    const customId = data.title + data.tags.toString();

    if (!user) {
      throw new Error("User was not defined while handling new Note inside Sidebar");
    }

    const newNote = {
      id: customId,
      title: data.title,
      content: "",
      date: new Date().toISOString(),
      tags: data.tags,
      userId: user.uid,
      loadingNote: true
    }

    // fallback array
    const oldNotes = [...notes];

    // This will give the user immediate feedback!
    dispatch(addNote(newNote));

    try {
      // Calling firebase
      const result = await createNote(newNote);

      if (!result.success) {
        setNotes(oldNotes);
      }

      if (result && result.id) {

        // Change id to the id which was given by firebase 
        const editedNote = { ...newNote, id: result.id, loadingNote: false };

        dispatch(changeNote({editedNote, customId}));
        dispatch(setActiveNote(result.id));
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
  const handleEditNote = async (data: { title: string, content: string, tags: Tag[] },
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

    const neededNote = findNote(noteId)

    if (!neededNote) return;

    // This will give the user immediate feedback!
    const editedNote = { ...neededNote, ...newNote };
    dispatch(changeNote({editedNote}));

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

  return {handleCreateNote, handleDeleteNote, handleEditNote };

}
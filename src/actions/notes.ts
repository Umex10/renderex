"use server"

import { db } from "@/lib/firebase/admin";
import { NotesArgs } from "../types/notesArgs";
import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth/requireUserId";

/**
 * Server Action to fetch the initial notes for a specific user.
 * Retrieves notes from the "notes" collection in Firestore where the userId matches.
 * 
 * @async
 * @returns {Promise<{success: boolean, data?: NotesArgs[], error?: string}>} An object containing the success status and either the list of notes or an error message.
 */
export async function getInitialNotes() {
  try {

    const validUserId = await requireUserId();

    // This will return all matched notes
    const snapshot = await db.collection("notes")
      .where("userId", "==", validUserId)
      .get();

    // Extracing the id from firebase, so firebase is managing that
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<NotesArgs, "id">)
    }));

    return { success: true, data: notes };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while loading the notes. Reason: " + error,
    };
  }
}

/**
 * Server Action to create a new note.
 * Verifies user authentication via cookies before creating the note in Firestore.
 * Revalidates the dashboard path "/dashboard" after successful creation.
 * 
 * @async
 * @param {NotesArgs} note - The note object to be created.
 * @returns {Promise<{success: boolean, id?: string, error?: unknown}>} An object containing the success status and either the new note ID or an error.
 * @throws {Error} If the user is not authenticated or if the user ID in the note does not match the authenticated user.
 */
export async function createNote(note: NotesArgs) {
  
  try {
    await requireUserId();

    // id is not needed, firebase is handling that
    const {id: _, ...newNote } = note;

    const noteRef = await db.collection("notes").add(newNote);

    revalidatePath("/dashboard");
    return {success: true, id: noteRef.id};

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while creating a note. Reason: " + err,
    };
  }

}

/**
 * Server Action to edit an existing note.
 * Verifies user authentication and authorization before updating the note in Firestore.
 * Revalidates the dashboard path "/dashboard" after successful update.
 * 
 * @async
 * @param {string} noteId - The ID of the note to be edited.
 * @param {Omit<NotesArgs, "id" | "userId">} note - The updated note content (excluding ID and userId).
 * @returns {Promise<{success: boolean, error?: unknown}>} An object indicating the success or failure of the operation.
 * @throws {Error} If the user is not authenticated, the note is not found, or the user is not authorized to edit the note.
 */
export async function editNote(noteId: string, note: Omit<NotesArgs, "id" | "userId">) {
  try {

     await requireUserId();

    const noteRef = db.collection("notes").doc(noteId);
    const snap = await noteRef.get();

    if (!snap.exists) {
      throw new Error("Note not found.");
    }

    await noteRef.update(note);

    revalidatePath("/dashboard");
    return { success: true };

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while updating the note. Reason: " + err,
    };
  }
}

/**
 * Server Action to delete a note.
 * Verifies user authentication and authorization before deleting the note from Firestore.
 * Revalidates the dashboard path "/dashboard" after successful deletion.
 * 
 * @async
 * @param {string} noteId - The ID of the note to be deleted.
 * @returns {Promise<{success: boolean, error?: unknown}>} An object indicating the success or failure of the operation.
 * @throws {Error} If the user is not authenticated, the note is not found, or the user is not authorized to delete the note.
 */
export async function deleteNote(noteId: string) {

  try {
     await requireUserId();
    
    const noteRef = db.collection("notes").doc(noteId);
    const snap = await noteRef.get();

    if (!snap.exists) {
      throw new Error("Note not found.");
    }

    await noteRef.delete();

    revalidatePath("/dashboard");
    return {success: true};

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while deleting the note. Reason: " + err,
    }
  }

}
"use server"

import { db } from "@/lib/firebase/admin";
import { NotesArgs } from "../types/notesArgs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Server Action to fetch the initial notes for a specific user.
 * Retrieves notes from the "notes" collection in Firestore where the userId matches.
 * 
 * @async
 * @param {string} userId - The unique identifier of the user whose notes are to be fetched.
 * @returns {Promise<{success: boolean, data?: NotesArgs[], error?: string}>} An object containing the success status and either the list of notes or an error message.
 */
export async function getInitialNotes(userId: string) {
  try {
    const snapshot = await db.collection("notes")
      .where("userId", "==", userId)
      .get();

    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<NotesArgs, "id">)
    }));

    return { success: true, data: notes };
  } catch (error) {
    return { success: false, error: "Error while loading the notes: " + error };
  }
}

/**
 * Server Action to create a new note.
 * Verifies user authentication via cookies before creating the note in Firestore.
 * Revalidates the root path "/" after successful creation.
 * 
 * @async
 * @param {NotesArgs} note - The note object to be created.
 * @returns {Promise<{success: boolean, id?: string, error?: unknown}>} An object containing the success status and either the new note ID or an error.
 * @throws {Error} If the user is not authenticated or if the user ID in the note does not match the authenticated user.
 */
export async function createNote(note: NotesArgs) {
  
  try {
    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }

    if (userIdCk !== note.userId) {
      throw new Error("The given user and the user from cookie are not the same!");
    }

    const {id: _, ...newNote } = note;

    const noteRef = await db.collection("notes").add(newNote);

    revalidatePath("/");
    return {success: true, id: noteRef.id};

  } catch (err) {
    console.error("Error occured while creating new Note: ", err);
    return {success: false, error: err};
  }

}

/**
 * Server Action to edit an existing note.
 * Verifies user authentication and authorization before updating the note in Firestore.
 * Revalidates the root path "/" after successful update.
 * 
 * @async
 * @param {string} noteId - The ID of the note to be edited.
 * @param {Omit<NotesArgs, "id" | "userId">} note - The updated note content (excluding ID and userId).
 * @returns {Promise<{success: boolean, error?: unknown}>} An object indicating the success or failure of the operation.
 * @throws {Error} If the user is not authenticated, the note is not found, or the user is not authorized to edit the note.
 */
export async function editNote(noteId: string, note: Omit<NotesArgs, "id" | "userId">) {
  try {

    const cookieStore = await cookies();
    const useridCk = cookieStore.get("userId")?.value;

    if (!useridCk) {
      throw new Error("User is not authenticated!");
    }

    const noteRef = db.collection("notes").doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      throw new Error("Note not found");
    }

    const noteData = doc.data();

    if (noteData?.userId !== useridCk) {
      throw new Error("You are not authorized to edit this note!");
    }

    await noteRef.update(note);

    revalidatePath("/");
    return { success: true };

  } catch (err) {
    console.error("Error while editing the note: ", err);
    return { success: false, error: err };
  }
}

/**
 * Server Action to delete a note.
 * Verifies user authentication and authorization before deleting the note from Firestore.
 * Revalidates the root path "/" after successful deletion.
 * 
 * @async
 * @param {string} noteId - The ID of the note to be deleted.
 * @returns {Promise<{success: boolean, error?: unknown}>} An object indicating the success or failure of the operation.
 * @throws {Error} If the user is not authenticated, the note is not found, or the user is not authorized to delete the note.
 */
export async function deleteNote(noteId: string) {

  try {
    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }
    
    const noteRef = db.collection("notes").doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      console.error(`Note with ID '${noteId}' not found in project '${process.env.FIREBASE_PROJECT_ID}'`);
      throw new Error("Note not found");
    }

    const noteData = doc.data();

    if (noteData?.userId !== userIdCk) {
      throw new Error("You are not authorized to use this note!");
    }

    await noteRef.delete();

    revalidatePath("/");
    return {success: true};

  } catch (err) {
    console.error("A server breach or related error occured, while deleting the note: ", err);
    return {success: false, error: err}
  }

}
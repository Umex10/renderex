"use server"

import { db } from "@/lib/firebase/admin";
import { NotesArgs, NotesDtoArgs } from "../../redux/slices/notesSlice";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

export async function createNote(note: NotesDtoArgs) {
  
  try {
    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }

    if (userIdCk !== note.userId) {
      throw new Error("The given user and the user from cookie are not the same!");
    }

    const {id, ...newNote } = note;

    const noteRef = await db.collection("notes").add(newNote);

    revalidatePath("/");
    return {success: true, id: noteRef.id};

  } catch (err) {
    console.error("Error occured while creating new Note: ", err);
    return {success: false, error: err};
  }

}

export async function editNote(noteId: string, note: Omit<NotesDtoArgs, "userId">) {
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

    // We dont need userId
    const {userId, ...editData} = note;

    await noteRef.update(editData);

    revalidatePath("/");
    return { success: true };

  } catch (err) {
    console.error("Error while editing the note: ", err);
    return { success: false, error: err };
  }
}

export async function deleteNote(noteId: string) {

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      throw new Error("User is not authenticated!");
    }
    
    const noteRef = db.collection("notes").doc(noteId);
    const doc = await noteRef.get();

    if (!doc.exists) {
      console.error(`Note with ID '${noteId}' not found in project '${process.env.FIREBASE_PROJECT_ID}'`);
      throw new Error("Note not found");
    }

    const noteData = doc.data();

    if (noteData?.userId !== userId) {
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
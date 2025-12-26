"use server"

import { db } from "@/lib/firebase/admin";
import { NotesArgs } from "../../redux/slices/notesSlice";
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

export async function deleteNote(id: string) {

  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      throw new Error("Not authenticated!");
    }

    const noteRef = db.collection("notes").doc(id);
    const doc = await noteRef.get();

    if (!doc.exists) {
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
    console.error("A server breack or related error occured, while deleting the note: ", err);
    return {success: false, error: err}
  }

}
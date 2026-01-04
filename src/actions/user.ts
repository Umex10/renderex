"use server"

import { requireUserId } from "@/lib/auth/requireUserId";
import { db, adminAuth } from "@/lib/firebase/admin";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";

/**
 * Fetches the initial user data from the server.
 * 
 * @returns {Promise<{success: boolean, data?: User, error?: string}>} The result of the operation.
 */
export async function getInitialUser() {
  try {

    const validUserId = await requireUserId();

    const userRef = db.collection("users").doc(validUserId);

    const snap = await userRef.get();

    if (!snap.exists) throw new Error("There is no such user!");

    const data = snap.data();

    const user : User = {
      uid: data?.uid,
      email: data?.email,
      username: data?.username,
      role: data?.role,
      imageURL: data?.imageURL,
      createdAt: data?.createdAt?.toDate().toISOString()
    };
    
    return {
      success: true,
      data: user
    }

  } catch (err) {
    return { success: false, error: "Error while loading the user:" + err };
  }
}


/**
 * Updates the user's information in the database.
 * 
 * @param {User} user - The user object containing updated data.
 * @returns {Promise<{success: boolean, error?: string}>} The result of the update operation.
 */
export async function editUser(user: User) {
  try {

    await requireUserId();

    const userRef = db.collection("users").doc(user.uid);

    const snap = await userRef.get();

    if (!snap.exists) {
      throw new Error("There is no such user!");
    }

    const { uid, createdAt, role, ...neededUser } = user;

    await userRef.update(neededUser)

    revalidatePath("/dashboard/account");
    return { success: true }

  } catch (err) {
    return { success: false, error: "Error while editing the user:" + err };
  }
}

/**
 * Deletes a user from both Authentication and Firestore.
 * 
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<{success: boolean, error?: string}>} The result of the deletion operation.
 */
export async function deleteUser(userId: string) {
  try {

    await requireUserId();

    await adminAuth.deleteUser(userId);

    const userRef = db.collection("users").doc(userId);

    await userRef.delete();
    cookieStore.delete("userId");

    revalidatePath("/dashboard/account");
    return { success: true }

  } catch (err) {
    return { success: false, error: "Error while deleting the user:" + err };
  }
}


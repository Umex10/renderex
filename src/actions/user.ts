"use server"

import { db, adminAuth } from "@/lib/firebase/admin";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


export async function getInitialUser(userId: string) {
  try {

    const userRef = db.collection("users").doc(userId);

    const snap = await userRef.get();

    if (!snap.exists) throw new Error("There is no such user!");

    const data = snap.data();

    const user = {
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


export async function editUser(user: User) {
  try {

    const cookieStore = await cookies();
    const useridCk = cookieStore.get("userId")?.value;

    if (!useridCk) {
      throw new Error("User is not authenticated!");
    }

    if (useridCk !== user.uid) {
      throw new Error("The given user and the user from cookie are not the same!");
    }

    const userRef = db.collection("users").doc(user.uid);

    const snap = await userRef.get();

    if (!snap.exists) {
      throw new Error("There is no such user!");
    }

    const { uid, createdAt, role, ...neededUser } = user;

    await userRef.set(neededUser, { merge: true })

    revalidatePath("/");
    return { success: true }

  } catch (err) {
    return { success: false, error: "Error while editing the user:" + err };
  }
}

export async function deleteU(userId: string) {
  try {

    const cookieStore = await cookies();
    const useridCk = cookieStore.get("userId")?.value;

    if (!useridCk) {
      throw new Error("User is not authenticated!");
    }

    if (useridCk !== userId) {
      throw new Error("The given user and the user from cookie are not the same!");
    }

    await adminAuth.deleteUser(userId);

    const userRef = db.collection("users").doc(userId);

    await userRef.delete();

    cookieStore.delete("userId");

    revalidatePath("/");
    return { success: true }

  } catch (err) {
    return { success: false, error: "Error while deleting the user:" + err };
  }
}


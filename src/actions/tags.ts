"use server"

import { db } from "@/lib/firebase/admin";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { cookies } from "next/headers";
import { success } from "zod";

export async function getInitialGlobalTags(userId: string) {
  try {

    const globalTagsRef = db.collection("globalTags").doc(userId)
    const snap = await globalTagsRef.get();

    // GlobalTags collection is not created
    if (!snap.exists) return {
      success: true, data: {
        userId: userId,
        tags: []
      }
    };

    const data = snap.data();
    return {
      success: true, data: {
        userId: userId,
        tags: data?.tags ?? []
      }
    };

  } catch (err) {
    return { success: false, error: "Error while loading the globalTags: " + err };
  }
}

export async function createGlobalTag(globalTag: Tag) {

  try {

    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }

    const globalTagsRef = db.collection("globalTags").doc(userIdCk);
    const snap = await globalTagsRef.get();

    const data = snap.data();

    let tags: Tag[] = [];

    if (snap.exists) {
      tags = snap.data()?.tags ?? [];
    }

    // We won't change the userId, but add the tag to the array
    await globalTagsRef.set(
      {
        userId: data?.userId,
        tags: [...tags, globalTag]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true };

  } catch (err) {
    return { success: false, error: "Error occured while creating new globalTags: " + err };
  }

}

export async function deleteGlobalTag(globalTag: Tag) {

  try {

    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }

    const globalTagsRef = db.collection("globalTags").doc(userIdCk);
    const snap = await globalTagsRef.get();

    const data = snap.data();

    // Check if there is data
    if (!data) return;

    // remove the tag from the array
    let tags: Tag[] = data.tags;
    tags = tags.filter(tag => tag.name !== globalTag.name);

    console.log("Tags after:", tags)

    // We won't change the userId, but add the tag to the array
    await globalTagsRef.set(
      {
        userId: data.userId,
        tags: [...tags]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true };

  } catch (err) {
    return { success: false, error: "Error occured while deleting globalTag:" + err };
  }
}

export async function editGlobalTag(globalTag: Tag, tagColor: string) {

  try {

    const cookieStore = await cookies();
    const userIdCk = cookieStore.get("userId")?.value;

    if (!userIdCk) {
      throw new Error("User is not authenticated!");
    }

    const globalTagsRef = db.collection("globalTags").doc(userIdCk);
    const snap = await globalTagsRef.get();

    const data = snap.data();

    // Check if there is data
    if (!data) return;

    const tags: Tag[] = data.tags;

    const editedTags = tags.map(tag => {
      if (tag.name === globalTag.name) {
        tag.color = tagColor;
      }
      return tag;

    })

    await globalTagsRef.set(
      {
        userId: data.userId,
        tags: [...editedTags]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true }

  } catch (err) {
    return { success: false, error: "Error occured while editing globalTag:" + err };
  }

}
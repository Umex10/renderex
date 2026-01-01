"use server"

import { db } from "@/lib/firebase/admin";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { cookies } from "next/headers";

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
    
    // We won't change the userId, but add the tag to the array
    await globalTagsRef.set(
      {
        userId: data?.userId,
        tags: [...data?.tags, globalTag]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return {success: true};

  } catch (err) {
    return { success: false, error: "Error while creating new globalTags: " + err};
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
    console.log("removing the object!");
    console.log("Tags before:", tags)
    tags = tags.filter(tag => tag.name !== globalTag.name);
    
    console.log("Tags after:", tags)
    
    // We won't change the userId, but add the tag to the array
    await globalTagsRef.set(
      {
        userId: data?.userId,
        tags: [...tags]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return {success: true};

  } catch (err) {
    return { success: false, error: "Error while creating new globalTags: " + err};
  }

}
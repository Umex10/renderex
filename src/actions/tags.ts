"use server"

import { db } from "@/lib/firebase/admin";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { cookies } from "next/headers";

// This validates if the user is really logged in currently
async function requireUserId() {
  const cookieStore = await cookies();
  const userIdCk = cookieStore.get("userId")?.value;

  if (!userIdCk) {
    throw new Error("User is not authenticated!");
  }
  return userIdCk;
}

export async function getInitialUserTags() {

  try {

    const validUserId = await requireUserId();

    const userTagsRef = db.collection("userTags").doc(validUserId)
    const snap = await userTagsRef.get();

    // Didn't find doc
    if (!snap.exists) {
      // This means there is no collection for this user, so we will just send an emty array to firebase
      await userTagsRef.set(
        {
          userId: validUserId,
          tags: []
        }
      );
      return {
        success: true, data: {
          userId: validUserId,
          tags: []
        }
      };
    }

    const data = snap.data();
    return {
      success: true, data: {
        userId: validUserId,
        tags: data?.tags ?? [] // emty array - fallback
      }
    };

  } catch (err) {
    return { success: false, error: "An error while loading the userTags:" + err };
  }
}

export async function createUserTag(tag: Tag) {

  try {

    const validUserId = await requireUserId();

    const userTagsRef = db.collection("userTags").doc(validUserId);
    const snap = await userTagsRef.get();

    const data = snap.data();
    const tags: Tag[] = data ? data.tags : [];  // emty array - fallback

    // We won't change the userId, but add the tag to the array
    await userTagsRef.set(
      {
        userId: validUserId,
        tags: [...tags, tag]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true };

  } catch (err) {
    return { success: false, error: "An error occured while creating new userTag:" + err };
  }

}

export async function deleteUserTag(tagToDelete: Tag) {

  try {

    const validUserId = await requireUserId();

    const userTagsRef = db.collection("userTags").doc(validUserId);
    const snap = await userTagsRef.get();

    // Nothing to delete
    if (!snap.exists && !snap.data()) return;

    const data = snap.data();

    // remove the tag from the array
    let tags: Tag[] = data?.tags;
    tags = tags.filter(tag => tag.name !== tagToDelete.name);

    // We won't change the userId, but add the tag to the array
    await userTagsRef.set(
      {
        userId: data?.userId,
        tags: [...tags]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true };

  } catch (err) {
    return { success: false, error: "An error occured while deleting a userTag:" + err };
  }
}

export async function editUserTag(tagToEdit: Tag, tagColor: string) {

  try {

    const validUserId = await requireUserId()

    const userTagsRef = db.collection("userTags").doc(validUserId);
    const snap = await userTagsRef.get();

    if (!snap.exists && !snap.data()) return;

    const data = snap.data();

    const tags: Tag[] = data?.tags;

    const editedTags = tags.map(tag => {
      if (tag.name === tagToEdit.name) {
        tag.color = tagColor;
      }
      return tag;

    })

    await userTagsRef.set(
      {
        userId: data?.userId,
        tags: [...editedTags]
      },
      { merge: true } // This will ensure that not changed fields are not affected
    )

    return { success: true }

  } catch (err) {
    return { success: false, error: "An error occured while editing a userTag:" + err };
  }

}
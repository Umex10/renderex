"use server"

import { db } from "@/lib/firebase/admin";
import { Tag } from "../types/tag";
import { requireUserId } from "@/lib/auth/requireUserId";

/**
 * Server Action to fetch the initial user tags.
 * Retrieves the user's tags from the "userTags" collection in Firestore.
 * If the user document does not exist, it creates a new one with an empty tags array.
 * 
 * @async
 * @returns {Promise<{success: boolean, data?: {userId: string, tags: Tag[]}, error?: string}>} An object containing the success status and either the user tags data or an error message.
 */
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
    return {
      success: false,
      error: "An error occurred while loading the user tags. Reason: " + err,
    };
  }
}

/**
 * Server Action to create a new user tag.
 * Adds a new tag to the user's "userTags" document in Firestore.
 * Uses `merge: true` to ensure that other fields in the document are not affected.
 * If the document doesn't exist, it will be created.
 * 
 * @async
 * @param {Tag} tag - The tag object to be added.
 * @returns {Promise<{success: boolean, error?: string}>} An object indicating the success or failure of the operation.
 */
export async function createUserTag(tag: Tag) {

  try {

    const validUserId = await requireUserId();

    const userTagsRef = db.collection("userTags").doc(validUserId);
    const snap = await userTagsRef.get();

    const data = snap.data();
    const tags: Tag[] = data ? data.tags : [];  // emty array - fallback

    await userTagsRef.set(
      {
        userId: validUserId,
        tags: [...tags, tag]
      },
      { merge: true }
    )

    return { success: true };

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while creating a user tag. Reason: " + err,
    };
  }

}

/**
 * Server Action to delete a user tag.
 * Removes a specific tag from the user's "userTags" document in Firestore.
 * Uses `update` to ensure that the operation only proceeds if the document exists.
 * 
 * @async
 * @param {Tag} tagToDelete - The tag object to be removed.
 * @returns {Promise<{success: boolean, error?: string}>} An object indicating the success or failure of the operation.
 */
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

    await userTagsRef.update(
      {
        userId: data?.userId,
        tags: [...tags]
      },
    )

    return { success: true };

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while deleting a user tag. Reason: " + err,
    };
  }
}

/**
 * Server Action to edit an existing user tag.
 * Updates the color of a specific tag in the user's "userTags" document in Firestore.
 * Uses `update` to ensure that the operation only proceeds if the document exists.
 * 
 * @async
 * @param {Tag} tagToEdit - The tag object to be edited.
 * @param {string} tagColor - The new color for the tag.
 * @returns {Promise<{success: boolean, error?: string}>} An object indicating the success or failure of the operation.
 */
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
    
    await userTagsRef.update(
      {
        userId: data?.userId,
        tags: [...editedTags]
      },
    )

    return { success: true }

  } catch (err) {
    return {
      success: false,
      error: "An error occurred while updating a user tag. Reason: " + err,
    };
  }

}
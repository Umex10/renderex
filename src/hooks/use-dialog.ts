"use client"

import { useEffect, useMemo } from "react";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/components/DialogNote";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NotesArgs } from "@/types/notesArgs";

/**
 * Arguments for the useDialog hook.
 */
interface UseDialogTagsArgs {
  form: UseFormReturn<FormSchema>,
  userTags: Tag[],
  user: User | null | undefined,
  noteId: string | null | undefined,
  setNote: (noteData: NotesArgs) => void;
}

/**
 * Custom hook to manage the dialog state and logic for notes.
 * 
 * Handles fetching note data, managing active tags, and providing
 * handlers for adding and removing tags within the dialog form.
 * 
 * @param {UseDialogTagsArgs} data - The arguments for the hook.
 * @returns {Object} An object containing suggested tags and tag handlers.
 */
export const useDialog = (data: UseDialogTagsArgs) => {

    const {form, userTags, user, noteId, setNote} = data

    useEffect(() => {
      if (!user || !data.noteId) return;
  
      // Get the reference of the note
      const noteRef = doc(db, "notes", data.noteId);
  
      // This will ensure that always the current data will be fetched from firebase
      const unsubscribe = onSnapshot(noteRef, (snap) => {
        if (!snap.exists()) {
          console.log("Note doesn't exist");
          return;
        }
  
        const noteData = {
          id: snap.id, // id given by firebase
          ...(snap.data() as Omit<NotesArgs, "id">)
        };
  
        setNote(noteData);
      }, (error) => {
        console.error("An error occurred while getting the active note: ", error);
      });
  
      return () => unsubscribe();
    }, [user, noteId]);



   // Watch will trigger the useMemo when the value has changed
   const activeTags = form.watch("tags");

   const suggestedTags = useMemo(() => {
      // Will only show tags, that are not already inside userTags
      const newTags = userTags.filter(userTag => !activeTags.some(activeTag => activeTag.name === userTag.name));
  
      return newTags.sort((a, b) => a.name.localeCompare(b.name));
    }, [userTags, activeTags]);

   function removeTag(tagToRemove: Tag) {
      const tags = form.getValues("tags");
  
      // Will remove the active tag
      const newTags = tags.filter(tag => tag.name !== tagToRemove.name);
      form.setValue("tags", newTags);
  
      if (userTags.some(userTag => userTag.name === tagToRemove.name)) return;
    }
  
    /**
     * Adds a suggested user tag to the form.
     * 
     * @param {Tag} tagToAdd - The tag to add.
     */
    function addSuggestedUserTag(tagToAdd: Tag) {
      const tags = form.getValues("tags");
  
      // Rejects same tag name
      if (tags.some(tag => tag.name === tagToAdd.name)) return;
  
      form.setValue("tags", [...tags, tagToAdd]);

    }

    /**
     * Removes a suggested user tag from the form.
     * 
     * @param {Tag} tagToRemove - The tag to remove.
     */
    function removeSuggestedUserTag(tagToRemove: Tag) {
      const tags = form.getValues("tags");
  
      // Rejects same tag name
     const filteredTags = tags.filter(tag => tag.name !== tagToRemove.name);
  
      form.setValue("tags", filteredTags);

    }

    return {suggestedTags, removeTag, addSuggestedUserTag, removeSuggestedUserTag}
}
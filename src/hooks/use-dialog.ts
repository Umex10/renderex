"use client"

import { useEffect, useMemo } from "react";
import { Tag } from "../../redux/slices/tags/tagsSlice";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/components/DialogNote";
import { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NotesArgs } from "@/types/notesArgs";

interface UseDialogTagsArgs {
  form: UseFormReturn<FormSchema>,
  globalTags: Tag[],
  user: User | null | undefined,
  noteId: string | null | undefined,
  setNote: (noteData: NotesArgs) => void;
}

export const useDialog = (data: UseDialogTagsArgs) => {

    const {form, globalTags, user, noteId, setNote} = data

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
        console.error("Firestore error while getting the active note: ", error);
      });
  
      return () => unsubscribe();
    }, [user, noteId]);



   // Watch will trigger the useMemo when the value has changed
   const activeTags = form.watch("tags");

   const suggestedTags = useMemo(() => {
      // Will only show tags, that are not already inside globalTags
      const newTags = globalTags.filter(tag => !activeTags.some(activeTag => activeTag.name === tag.name));
  
      return newTags.sort((a, b) => a.name.localeCompare(b.name));
    }, [globalTags, activeTags]);

   function removeTag(tagToRemove: Tag) {
      const tags = form.getValues("tags");
  
      // Will remove the active tag
      const newTags = tags.filter(tag => tag.name !== tagToRemove.name);
      form.setValue("tags", newTags);
  
      if (globalTags.some(globalTag => globalTag.name === tagToRemove.name)) return;
  
      // suggest the global tag again
      suggestedTags.push(tagToRemove);
    }
  
    // Ensures that the user can add/remove tags from the outside (global tags)
    function addSuggestedGlobalTag(tagToAdd: Tag) {
      const tags = form.getValues("tags");
  
      // Rejects same tag name
      if (tags.some(tag => tag.name === tagToAdd.name)) return;
  
      form.setValue("tags", [...tags, tagToAdd]);
  
      // remove the suggested global tag
      suggestedTags.filter(tag => tag !== tagToAdd);
    }

    return {suggestedTags, removeTag, addSuggestedGlobalTag}
}
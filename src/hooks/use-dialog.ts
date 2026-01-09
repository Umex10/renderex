"use client"

import {useMemo } from "react";
import { Tag } from "../types/tag";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "@/components/DialogNote";

/**
 * Arguments for the useDialog hook.
 */
interface UseDialogTagsArgs {
  form: UseFormReturn<FormSchema>,
  userTags: Tag[],
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

  const {form, userTags} = data

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
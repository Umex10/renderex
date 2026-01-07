"use client"

import { NotesArgs } from "@/types/notesArgs";
import { useEffect, useMemo, useState } from "react";
import { Tag } from "../../redux/slices/tags/tagsSlice";

/**
 * Arguments for the useMatchedTags hook.
 */
interface UseMatchedTagsArgs {
  notes: NotesArgs[],
  userTags: Tag[],
  handleEditNote: (data: { title: string, content: string, tags: Tag[] }, noteId: string) => void,
  sortAfter: string,
  isDescending: boolean,
  selectedTags: Tag[],
  deletedUserTag: Tag | null,
  setDeletedUserTag: (tag: Tag | null) => void;

}

/**
 * Custom hook to filter, sort, and synchronize tags for notes.
 * 
 * Ensures notes only contain valid user tags, handles tag deletion synchronization,
 * applies color matching from user tags to note tags, and sorts notes based on criteria.
 * 
 * @param {UseMatchedTagsArgs} data - The arguments for the hook.
 * @returns {NotesArgs[]} The processed and sorted list of notes.
 */
export const useMatchedTags = (data: UseMatchedTagsArgs) => {

  const { notes, userTags, handleEditNote, sortAfter,
    isDescending, selectedTags, deletedUserTag, setDeletedUserTag } = data;

  const [loadingTags, setLoadingTags] = useState(true);

  const sortedUserTags = useMemo(() => {
    return [...userTags].sort((a, b) => a.name.localeCompare(b.name));
  }, [userTags]);

  useEffect(() => {
    function handleLoadingTags() {
      setLoadingTags(false);
    }
    handleLoadingTags();
  }, [sortedUserTags.length])

  // This will ensure, that a note doesn't contain tags, that are not in user tags.
  const matchedTagsNotes = useMemo(() => {
    return [...notes].map(note => {
      const updatedTags = note.tags.filter(tag => {
        if (!deletedUserTag) return true;

        return tag.name !== deletedUserTag.name;
      });

      return {
        ...note,
        tags: updatedTags,
      };
    });
  }, [notes, deletedUserTag]);

  // If matchesTagNotes changed, call the server action to actually set the new tags object 
  // in firebase
  useEffect(() => {

    if (!deletedUserTag) return;

    matchedTagsNotes.forEach((note, index) => {

      if (notes[index].tags.length !== note.tags.length) {

        // This means something has changed, we need to tell firebase
        handleEditNote(note, note.id);
      }
    });
    // set it to null, since we don't want any sideEffects with it
    setDeletedUserTag(null);
  }, [matchedTagsNotes, deletedUserTag]);

  const refactoredNotes = useMemo(() => {

    // This will ensure, that each tag inside the note will have the same color as 
    // the userTag one
    const matchedColorsNotes = [...notes].map(note => {
      const updatedTags = note.tags.map(tag => {
        const foundUserTag = userTags.find(
          userTag => userTag.name === tag.name
        );

        // New Tag, ignore it
        if (!foundUserTag) return tag;

        // Set the same color as in userTag
        if (foundUserTag.color === tag.color) return tag;

        return {
          ...tag,
          color: foundUserTag.color,
        };
      });

      return {
        ...note,
        tags: updatedTags,
      };
    });

    switch (sortAfter) {
      case "date":
        if (isDescending) {
          return [...matchedColorsNotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        } else {
          return [...matchedColorsNotes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }
      case "title":
        if (isDescending) {
          return [...matchedColorsNotes].sort((a, b) => b.title.localeCompare(a.title));
        } else {
          return [...matchedColorsNotes].sort((a, b) => a.title.localeCompare(b.title));
        }
      case "tags":
        return [...matchedColorsNotes].filter(note =>
          note.tags.some(tag => selectedTags.some(selectedTag => selectedTag.name === tag.name))
        );
      default:
        return matchedColorsNotes;
    }

  }, [notes, sortAfter, isDescending, selectedTags, userTags])

  return { loadingTags, refactoredNotes, sortedUserTags }
}
"use client"

import { NotesArgs } from "@/types/notesArgs";
import { useEffect, useMemo } from "react";
import { Tag } from "../../redux/slices/tags/tagsSlice";

interface UseMatchedTagsArgs {
  notes: NotesArgs[],
  globalTags: Tag[],
  handleEdit: (data: { title: string, content: string, tags: Tag[] }, noteId: string) => void,
  sortAfter: string,
  isDescending: boolean,
  selectedTags: Tag[],
  deletedGlobalTag: Tag | null,
  setDeletedGlobalTag: (globalTag: Tag | null) => void;

}

export const useMatchedTags = (data: UseMatchedTagsArgs) => {

  const { notes, globalTags, handleEdit, sortAfter,
    isDescending, selectedTags, deletedGlobalTag, setDeletedGlobalTag } = data;

      // This will ensure, that a note doesn't contain tags, that are not in global tags.
    const matchedTagsNotes = useMemo(() => {
    return [...notes].map(note => {
      const updatedTags = note.tags.filter(noteTag => {
        if (!deletedGlobalTag) return true;

          return noteTag.name !== deletedGlobalTag.name;
      });

      return {
        ...note,
        tags: updatedTags,
      };
    });
  }, [notes, globalTags, deletedGlobalTag, setDeletedGlobalTag]);

  // If matchesTagNotes changed, call the server action to actually set the new tags object 
  // in firebase
  useEffect(() => {

    if (!deletedGlobalTag) return;

    matchedTagsNotes.forEach((note, index) => {

      if (notes[index].tags.length !== note.tags.length) {

        // This means something has changed, we need to tell firebase
        handleEdit(note, note.id);
      }

      // set it to null, since we don't want any sideEffects with it
      setDeletedGlobalTag(null);
    });
  }, [matchedTagsNotes, deletedGlobalTag]);

  const refactoredNotes = useMemo(() => {

    // This will ensure, that each tag inside the note will have the same color as 
    // the globalTag one
    const matchedColorsNotes = [...notes].map(note => {
      const updatedTags = note.tags.map(noteTag => {
        const globalTag = globalTags.find(
          globalTag => globalTag.name === noteTag.name
        );

        // New Tag, ignore it
        if (!globalTag) return noteTag;

        // Set the same color as in globalTag
        if (globalTag.color === noteTag.color) return noteTag;

        return {
          ...noteTag,
          color: globalTag.color,
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
          note.tags.some(noteTag => selectedTags.some(selectedTag => selectedTag === noteTag))
        );
      default:
        return matchedColorsNotes;
    }

  }, [notes, sortAfter, isDescending, selectedTags, globalTags])

  const sortedGlobalTags = useMemo(() => {
    return [...globalTags].sort((a, b) => a.name.localeCompare(b.name));
  }, [globalTags])


  return { refactoredNotes, sortedGlobalTags }
}
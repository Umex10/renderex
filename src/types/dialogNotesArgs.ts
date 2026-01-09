import { Tag } from "../types/tag";
import { NotesArgs } from "./notesArgs";

/**
 * Data required to create a new note.
 * @typedef {Object} NoteDataForNew
 * @property {string} title - The title of the new note.
 * @property {Tag[]} tags - The tags associated with the new note.
 */
export type NoteDataForNew = {
  title: string;
  tags: Tag[];
};

/**
 * Data required to edit an existing note.
 * @typedef {Object} NoteDataForEdit
 * @property {string} title - The updated title of the note.
 * @property {string} content - The updated content of the note.
 * @property {Tag[]} tags - The updated tags of the note.
 */
export type NoteDataForEdit = {
  title: string;
  content: string
  tags: Tag[];
};

/**
 * Discriminated union for dialog form props.
 * Determines the mode (create vs. edit) and the corresponding action handler.
 * 
 * @typedef {Object} DialogNoteArgs
 * @property {boolean} edit - Whether the form is in edit mode.
 * @property {Function} onAction - Callback invoked on submit.
 * @property {string} [noteId] - The ID of the note to edit (required when `edit` is true).
 * @property {(tag: Tag) => void} handleNewUserTag - Adds a new tag for the current user.
 * @property {(tag: Tag, tagColor: string) => void} handleEditUserTag - Updates an existing user tag (including its color).
 * @property {(tag: Tag, tagColor: string) => void} handleEditedColorNotes - Applies a tag color change to any notes that use the tag.
 */
export type DialogNoteArgs =
  {
    note?: NotesArgs,
    edit: boolean;
    handleCreateNote: (data: NoteDataForNew) => void,
    handleEditNote: (data: NoteDataForEdit, id: string) => void,
    handleNewUserTag: (tag: Tag) => void;
    handleEditUserTag: (tag: Tag, tagColor: string) => void,
    handleEditedColorNotes: (tag: Tag, tagColor: string) => void,
  }

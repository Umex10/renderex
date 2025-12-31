import { Tag } from "../../redux/slices/tags/tagsSlice";

/**
 * Type definition for the data required to create a new note.
 * @typedef {Object} NoteDataForNew
 * @property {string} title - The title of the new note.
 * @property {string[]} tags - The tags associated with the new note.
 */
export type NoteDataForNew = {
  title: string;
  tags: Tag[];
};

/**
 * Type definition for the data required to edit an existing note.
 * @typedef {Object} NoteDataForEdit
 * @property {string} title - The updated title of the note.
 * @property {string} content - The updated content of the note.
 * @property {string[]} tags - The updated tags of the note.
 */
export type NoteDataForEdit = {
  title: string;
  content: string
  tags: Tag[];
};

/**
 * Discriminated Union for DialogForm props.
 * Determines the mode (create or edit) and the corresponding action handler.
 * 
 * @typedef {Object} DialogNoteArgs
 * @property {boolean} edit - Flag to indicate if the form is in edit mode.
 * @property {Function} onAction - Callback function to handle the form submission.
 * @property {string} [noteId] - The ID of the note to edit (required if edit is true).
 */
export type DialogNoteArgs =
  | {
    edit: false;
    onAction: (data: NoteDataForNew) => void;
    noteId?: never; 
    handleNewGlobalTag: (globalTag: Tag) => void;
  }
  | {
    edit: true;
    noteId: string; 
    onAction: (data: NoteDataForEdit, id: string) => void;
    handleNewGlobalTag: (globalTag: Tag) => void;
  };
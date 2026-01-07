import { Tag } from "../../redux/slices/tags/tagsSlice";

/**
 * Represents the structure of a note object.
 * @interface NotesArgs
 * @property {string} id - The unique identifier of the note.
 * @property {string} title - The title of the note.
 * @property {string} content - The main content/body of the note.
 * @property {string} date - The creation or modification date of the note as a string.
 * @property {Tag[]} tags - An array of tags associated with the note.
 * @property {string} userId - The unique identifier of the user who owns the note.
 */
export interface NotesArgs {
  id: string,
  title: string,
  content: string,
  date: string,
  tags: Tag[],
  userId: string,
  loadingNote?: boolean
}
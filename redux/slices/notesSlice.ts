import { NotesArgs } from "@/types/notesArgs";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  activeNote: string | null,
  notes: NotesArgs[],
  loadingNotes: boolean,
  creatingNote: {
    noteId: string,
    status: boolean
  },
  deletingNote: {
    noteId: string,
    status: boolean
  }
}

const initialState: NotesState = {
  activeNote: null,
  notes: [],
  loadingNotes: false,
  creatingNote: {
    noteId: "",
    status: false
  },
  deletingNote: {
    noteId: "",
    status: false
  }
}

/**
 * A Redux slice for managing notes state.
 * Handles actions related to notes, such as setting the active note.
 */
const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {

    //The dispatched action containing the note ID as payload.
    setActiveNote: (state, action: PayloadAction<string>) => {
      state.activeNote = action.payload;
    },

    setNotes: (state, action: PayloadAction<NotesArgs[]>) => {
      state.notes = action.payload
    },

    addNote: (state, action: PayloadAction<NotesArgs>) => {
      state.notes.push(action.payload);
    },

    removeNote: (state, action: PayloadAction<string>) => {
      state.notes.filter(note => note.id !== action.payload)
    },
    changeNote: (state, action: PayloadAction<{
      editedNote: NotesArgs
      customId?: string
    }>) => {
      const { editedNote, customId } = action.payload;
      let index;
      // if the customId is defined, then it will be the id of the new created note. 
      // so we need to relace it with the id coming from firebase.

      // if undefined, then we will just edit the existing note 
      if (customId) {
        index = state.notes.findIndex(note => note.id === customId);
      } else {
        index = state.notes.findIndex(note => note.id === editedNote.id);
      }
      if (index !== -1) {
        state.notes[index] = action.payload.editedNote;
      }
    },
    setLoadingNotes: (state, action: PayloadAction<boolean>) => {
      state.loadingNotes = action.payload;
    },
    setCreatingNote: (state, action: PayloadAction<{ noteId: string, status: boolean }>) => {
      const { noteId, status } = action.payload;

      state.creatingNote.noteId = noteId;
      state.creatingNote.status = status;
    },
     setDeletingNote: (state, action: PayloadAction<{ noteId: string, status: boolean }>) => {
      const { noteId, status } = action.payload;

      state.deletingNote.noteId = noteId;
      state.deletingNote.status = status;
    },
  }
})

export const { setActiveNote, setNotes, addNote, removeNote, changeNote,
  setLoadingNotes, setCreatingNote, setDeletingNote } = notesSlice.actions;
export default notesSlice.reducer;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface NotesArgs {
  id: string,
  title: string,
  content: string,
  date: string,
  tags: string[]
}

interface NotesState {
  notes: NotesArgs[],
  activeNote: NotesArgs | null
}

const initialState: NotesState = {
  notes: [],
  activeNote: null
}

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<NotesArgs>) => {
      state.notes.push(action.payload);
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setActiveNote: (state, action: PayloadAction<NotesArgs>) => {
      const found = state.notes.find(note => note.id === action.payload.id);

      if (found) {
        state.activeNote = action.payload
      }
    },
    setContent: (state, action: PayloadAction<string>) => {
      if (!state.activeNote) return;
      // only coie!
      state.activeNote.content = action.payload;

      // reinitialize the content of the object in the array as well as to avoid
      // unsynchronous content
      const index = state.notes.findIndex(note => note.id === state.activeNote?.id);
      if (index !== -1) {
        state.notes[index].content = action.payload;
      }
    }
  }
})

export const { addNote, removeNote, setActiveNote, setContent } = notesSlice.actions;
export default notesSlice.reducer;
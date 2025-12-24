import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface NotesArgs {
  id: string,
  title: string,
  data: string,
  tags: string[]
}

const initialState: NotesArgs[] = []

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<NotesArgs>) => {
      state.push(action.payload);
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.filter(note => note.id !== action.payload);
    }
  }
})

export const { addNote } = notesSlice.actions;
export default notesSlice.reducer;
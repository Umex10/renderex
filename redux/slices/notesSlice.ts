import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  activeNote: string
}

const initialState: NotesState = {
  activeNote: ""
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
  }
})

export const { setActiveNote } = notesSlice.actions;
export default notesSlice.reducer;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Tag {
  name: string,
  color: string
}

interface NotesState {
  globalTags: Tag[],
}

const initialState: NotesState = {
  globalTags: [{ name: "java", color: "#e74c3c" }, { name: "react", color: "#3498db" },
  { name: "c++", color: "#f1c40f" }, { name: "ney", color: "#2ecc71" },
  ],
}

const tagsSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addGlobalTag: (state, action: PayloadAction<Tag>) => {
      state.globalTags.push(action.payload);
    },
    removeGlobalTag: (state, action: PayloadAction<Tag>) => {
      state.globalTags = state.globalTags.filter(tag => tag.name !== action.payload.name);
    },
    editColor: (state, action: PayloadAction<{ tagName: string, newColor: string }>) => {

      const { tagName, newColor } = action.payload;

      state.globalTags = state.globalTags.map(tag => tag.name === tagName ? {...tag, color: newColor} : tag);

  }
}})

export const { addGlobalTag, removeGlobalTag, editColor } = tagsSlice.actions;
export default tagsSlice.reducer;
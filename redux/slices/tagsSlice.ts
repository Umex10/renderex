import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  globalTags: string[],
 //
}

const initialState: NotesState = {
  globalTags: ["java", "react", "c++", "fut"],
  //
}

const tagsSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addGlobalTag: (state, action: PayloadAction<string>) => {
      state.globalTags.push(action.payload);
    },
    removeGlobalTag: (state, action: PayloadAction<string>) => {
      state.globalTags = state.globalTags.filter(tag => tag !== action.payload);
    },
    // addSuggestedTag: (state, action: PayloadAction<string>) => {
    //   state.suggestedTags.push(action.payload);
    // },
    // removeSuggestedTag: (state, action: PayloadAction<string>) => {
    //   state.suggestedTags = state.suggestedTags.filter(tag => tag !== action.payload);
    // },
  }
})

export const { addGlobalTag, removeGlobalTag } = tagsSlice.actions;
export default tagsSlice.reducer;
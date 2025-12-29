import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";

export interface Tag {
  name: string,
  color: string
}

interface NotesState {
  globalTags: Tag[],
}

const initialState: NotesState = {
  globalTags: [{name: "java", color: ""}, {name: "react", color: ""}, 
    {name: "c++", color: ""}, {name: "ney", color: ""},
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
}})

export const { addGlobalTag, removeGlobalTag } = tagsSlice.actions;
export default tagsSlice.reducer;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Tag {
  name: string,
  color: string
}

export interface GlobalTags {
  userId: string | null
  tags: Tag[],

}

const initialState: GlobalTags = {
  tags: [],
  userId: null
}

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setWholeArray: (state, action: PayloadAction<Tag[]>) => {
      state.tags = [...action.payload];
    },
    addGlobalTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    removeGlobalTag: (state, action: PayloadAction<Tag>) => {
      state.tags = state.tags.filter(tag => tag.name !== action.payload.name);
    },
    editColor: (state, action: PayloadAction<{ tagName: string, newColor: string }>) => {

      const { tagName, newColor } = action.payload;

      state.tags = state.tags.map(tag => tag.name === tagName ? {...tag, color: newColor} : tag);
  }
}})

export const { setWholeArray,setUserId, addGlobalTag, removeGlobalTag, editColor } = tagsSlice.actions;
export default tagsSlice.reducer;
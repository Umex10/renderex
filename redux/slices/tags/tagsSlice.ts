import { Tag } from "@/types/tag";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserTags {
  tags: Tag[],
}

const initialState: UserTags = {
  tags: [],
}

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setWholeTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = [...action.payload];
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<Tag>) => {
      state.tags = state.tags.filter(tag => tag.name !== action.payload.name);
    },
    editColor: (state, action: PayloadAction<{ tagName: string, newColor: string }>) => {

      const { tagName, newColor } = action.payload;

      state.tags = state.tags.map(tag => tag.name === tagName ? { ...tag, color: newColor } : tag);
    }
  }
})

export const { setWholeTags, addTag, removeTag, editColor } = tagsSlice.actions;
export default tagsSlice.reducer;
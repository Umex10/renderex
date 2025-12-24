import { configureStore } from "@reduxjs/toolkit";
import notesSlice from "./slices/notesSlice";

export const store = configureStore({
  reducer: {
    notesState: notesSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
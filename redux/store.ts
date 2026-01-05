import { configureStore } from "@reduxjs/toolkit";
import notesSlice from "./slices/notesSlice";
import formatSlice from "./slices/formatSlice";
import tagsSlice from "./slices/tags/tagsSlice";
/**
 * The Redux store configuration.
 * Combines reducers and sets up the store for the application.
 * @see {@link https://redux-toolkit.js.org/api/configureStore}
 */
export const store = configureStore({
  reducer: {
    notesState: notesSlice,
    formState: formatSlice,
    tagsState: tagsSlice
  }
})

/**
 * Type definition for the root state of the application.
 * Inferred from the store's state.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type definition for the application's dispatch function.
 * Inferred from the store's dispatch.
 */
export type AppDispatch = typeof store.dispatch;
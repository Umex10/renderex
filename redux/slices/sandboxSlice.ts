import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface  SandboxState {
  sandboxContent: string,
  showSandbox: boolean,
  isSandboxActive: boolean,
  isTryAgainActive: boolean
}

const initialState: SandboxState = {
  sandboxContent: "",
  showSandbox: false,
  isSandboxActive: false,
  isTryAgainActive: false
}

const sandboxSlice = createSlice({
  name: "sandbox",
  initialState,
  reducers: {
    setSandboxContent: (state, action: PayloadAction<string> ) => {
      state.sandboxContent = action.payload;
    },
    setShowSandbox: (state, action: PayloadAction<boolean>) => {
      state.showSandbox = action.payload
    },
    setIsSandboxActive: (state, action: PayloadAction<boolean>) => {
      state.isSandboxActive = action.payload
    },
    setIsTryAgainActive: (state, action: PayloadAction<boolean>) => {
      state.isTryAgainActive = action.payload
    }
  }
})

export const {setSandboxContent, setShowSandbox, setIsSandboxActive,
  setIsTryAgainActive
} = sandboxSlice.actions;
export default sandboxSlice.reducer;
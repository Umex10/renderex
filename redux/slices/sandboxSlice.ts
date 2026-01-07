import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface SandboxState {
  sandboxContent: string,
  showSandbox: boolean,
  isSandboxActive: boolean,
  isTryAgainActive: boolean,
  isTransferActive: boolean,
  sandboxHistory: string[]
}

const initialState: SandboxState = {
  sandboxContent: "",
  showSandbox: false,
  isSandboxActive: false,
  isTryAgainActive: false,
  isTransferActive: false,
  sandboxHistory: [],
}

const sandboxSlice = createSlice({
  name: "sandbox",
  initialState,
  reducers: {
    setSandboxContent: (state, action: PayloadAction<string>) => {
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
    },
    setIsTransferActive: (state, action: PayloadAction<boolean>) => {
      state.isTransferActive = action.payload
    },
    addToSandboxHistory: (state, action: PayloadAction<string>) => {
      state.sandboxHistory.push(action.payload)
    },
  }
})

export const { setSandboxContent, setShowSandbox, setIsSandboxActive,
  setIsTryAgainActive, setIsTransferActive, addToSandboxHistory
} = sandboxSlice.actions;
export default sandboxSlice.reducer;
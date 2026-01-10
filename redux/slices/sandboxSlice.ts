import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface SandboxState {
  activeSandboxContent: string,
  showSandbox: boolean,
  isSandboxActive: boolean,
  isTryAgainActive: boolean,
  isTransferActive: boolean,
  sandboxHistory: string[]
}

const initialState: SandboxState = {
  activeSandboxContent: "",
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
    setContentOfActiveSandbox: (state, action: PayloadAction<string>) => {
      state.activeSandboxContent = action.payload
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
    setContentOfSandboxIndex: (state, action: PayloadAction<{
      index: number,
      content: string
    }>) => {
      const {index, content} = action.payload;
      state.sandboxHistory[index] = content;
    },
  }
})

export const {setContentOfActiveSandbox, setShowSandbox, setIsSandboxActive,
  setIsTryAgainActive, setIsTransferActive, addToSandboxHistory,
  setContentOfSandboxIndex
} = sandboxSlice.actions;
export default sandboxSlice.reducer;
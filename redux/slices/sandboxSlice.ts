import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface SandboxState {
  content: string,
  sandboxContent: string,
  showSandbox: boolean,
  isSandboxActive: boolean,
  isTryAgainActive: boolean,
  sandboxHistory: string[]
}

const initialState: SandboxState = {
  content: "",
  sandboxContent: "",
  showSandbox: false,
  isSandboxActive: false,
  isTryAgainActive: false,
  sandboxHistory: [],
}

const sandboxSlice = createSlice({
  name: "sandbox",
  initialState,
  reducers: {
     setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
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
    addToSandboxHistory: (state, action: PayloadAction<string>) => {
      state.sandboxHistory.push(action.payload)
    },
    setContentOfSandbox: (state, action: PayloadAction<{
      index: number,
      content: string
    }>) => {
      const {index, content} = action.payload;
      state.sandboxHistory[index] = content;
    },
  }
})

export const {setContent, setShowSandbox, setIsSandboxActive,
  setIsTryAgainActive, addToSandboxHistory,
  setContentOfSandbox
} = sandboxSlice.actions;
export default sandboxSlice.reducer;
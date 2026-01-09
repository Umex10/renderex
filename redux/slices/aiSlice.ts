import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AI_STATE } from "../../constants/loadingStates/AiState";

interface AiState{
  status: typeof AI_STATE[keyof typeof AI_STATE]
}

const initialState: AiState = {
  status: "idle"
}

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setAiState: (state, action: PayloadAction<typeof AI_STATE[keyof typeof AI_STATE]>) => {
      state.status = action.payload;
    }
  }
})

export const { setAiState } = aiSlice.actions;
export default aiSlice.reducer;
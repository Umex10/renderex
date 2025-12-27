import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface formatState {
  format: string
}

const initialState: formatState = {
  format: ""
}


const formatSlice = createSlice({
  name: "format",
  initialState,
  reducers: {
    setFormatState: (state, action: PayloadAction<string>) => {
      state.format = action.payload;
    },
  }
})

export const { setFormatState } = formatSlice.actions;
export default formatSlice.reducer;
import { User } from "@/types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null,
  userRetreat: User | null
}

const initialState: UserState = {
  user: null,
  userRetreat: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setRetrietUser: (state, action: PayloadAction<User>) => {
      state.userRetreat = action.payload
    }
  }
})

export const {setUser, setRetrietUser} = userSlice.actions;
export default userSlice.reducer;
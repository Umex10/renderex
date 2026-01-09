import { User } from "@/types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: User | null = {
  uid: "",
  email: "",
  role: "",
  username: "",
  imageURL: "",
  createdAt: "",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
   
  }
})


export const {  } = userSlice.actions;
export default userSlice.reducer;
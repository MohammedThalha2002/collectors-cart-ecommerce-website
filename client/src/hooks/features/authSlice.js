import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "emaillliuu",
  },
  reducers: {
    addEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addEmail } = authSlice.actions;

export default authSlice.reducer;

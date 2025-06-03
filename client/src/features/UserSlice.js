import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("currentUser");

const initialState = {
  CurrentUser: savedUser ? JSON.parse(savedUser) : null,
};

const UserSlice = createSlice({
  name: "CurrentUser",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = {
        id: action.payload.id,
        user_name: action.payload.user_name,
        role: action.payload.role,
      };
      state.CurrentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
    },
    clearUser: (state) => {
      state.CurrentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setUser, clearUser } = UserSlice.actions;

export default UserSlice.reducer;

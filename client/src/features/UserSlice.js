import { createSlice, current } from "@reduxjs/toolkit";


const initialState = {
    CurrentUser: null
}


const UserSlice = createSlice({
    name: "CurrentUser",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.CurrentUser = {
                user_name: action.payload.user_name,
                role: action.payload.role,
            };
        },
        clearUser: (state) => {
            state.CurrentUser = null;
        },
    }
})

export const { setUser , clearUser } = UserSlice.actions

export default UserSlice.reducer
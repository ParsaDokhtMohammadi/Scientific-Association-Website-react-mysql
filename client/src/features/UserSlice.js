import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    CurrentUser: {id:3,user_name : "ali" , role : "admin"}
}


const UserSlice = createSlice({
    name: "CurrentUser",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.CurrentUser = {
                id : action.payload.id,
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
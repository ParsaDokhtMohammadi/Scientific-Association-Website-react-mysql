import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "../services/ApiSlice";
import UserSlice from "../features/UserSlice"
export const store = configureStore({
    reducer:{
        CurrentUser : UserSlice ,
        [ApiSlice.reducerPath] : ApiSlice.reducer 
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(ApiSlice.middleware)
})
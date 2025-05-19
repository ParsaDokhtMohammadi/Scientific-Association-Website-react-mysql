import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const ApiSlice = createApi({
    reducerPath:"DBApi",
    baseQuery : fetchBaseQuery({baseUrl:"http://localhost:3000"}),
    endpoints : (builder) => ({
        getEvents : builder.query({query: () => "/getEvents"})
    })
})





export const {useGetEventsQuery} = ApiSlice
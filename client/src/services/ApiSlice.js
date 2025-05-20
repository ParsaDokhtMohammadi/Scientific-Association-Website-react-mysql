import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const ApiSlice = createApi({
    reducerPath:"DBApi",
    baseQuery : fetchBaseQuery({baseUrl:"http://localhost:5000"}),
    tagTypes: ['Events'],
    endpoints : (builder) => ({
        getEvents : builder.query({query: () => "/getEvents",providesTags: ['Events'],}),
        getUsers : builder.query({query:()=>"/getUsers"}),
        getNews : builder.query({query: ()=> "/getNews"}),



        Login : builder.mutation({
            query:(credentials) =>({
                url: "/Login",
                method: "POST",
                body : credentials
            })
        }),
        Register : builder.mutation({
            query:(credentials)=>({
                url:"/Register",
                method:"POST",
                body : credentials
            })
        }),
        DeleteEvent : builder.mutation({
            query:(credentials)=>({
                url:"/DeleteEvent",
                method:"DELETE",
                body: credentials
            }),
            invalidatesTags: ['Events']
        })
    })
})





export const {useGetEventsQuery , useGetNewsQuery , useGetUsersQuery ,useLazyGetUsersQuery , useLoginMutation , useRegisterMutation , useDeleteEventMutation} = ApiSlice
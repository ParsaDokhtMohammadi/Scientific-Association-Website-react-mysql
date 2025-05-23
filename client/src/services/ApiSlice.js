import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const ApiSlice = createApi({
    reducerPath:"DBApi",
    baseQuery : fetchBaseQuery({baseUrl:"http://localhost:5000"}),
    tagTypes: ['Events'],
    endpoints : (builder) => ({
        getEvents : builder.query({query: () => "/getEvents",providesTags: ['Events'],}),
        getUsers : builder.query({query:()=>"/getUsers"}),
        getAllsubmissions :builder.query({query:()=>"/getAllSubmission"}) ,
        getPendingsubmissions :builder.query({query:()=>"/getPendingSubmission"}) ,
        getNews : builder.query({query: ()=> "/getNews", providesTags:["News"]}),
        getUserSubmissions: builder.query({query: (userId) => `/UserSubmission?id=${userId}`,}),


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
        }),
        DeleteNews : builder.mutation({
            query:(credentials)=>({
                url:"/DeleteNews",
                method:"DELETE",
                body:credentials
            }),
            invalidatesTags : ["News"]
        }),
        Submit : builder.mutation({
            query:(credentials)=>({
                url: "Submission",
                method:"POST",
                body:credentials
            })
        })
    })
})





export const {useGetEventsQuery , useGetNewsQuery ,useGetUserSubmissionsQuery,
    useGetUsersQuery ,useLazyGetUsersQuery , useLoginMutation ,
     useRegisterMutation , useDeleteNewsMutation,useSubmitMutation,
      useDeleteEventMutation ,useGetPendingsubmissionsQuery,useGetAllsubmissionsQuery} = ApiSlice
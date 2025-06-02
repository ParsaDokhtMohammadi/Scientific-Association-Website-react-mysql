import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiSlice = createApi({
  reducerPath: "DBApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: ["Events", "Users", "Admins&Members", "AllSubmissions", "PendingSubmissions", "News", "eventComments", "NewsComments", "AllRegistrations", "Registration", "EventRegister" , 'userSubmission'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/getEvents",
      providesTags: ["Events"],
    }),
    getUsers: builder.query({
      query: () => "/getUsers",
      providesTags: ["Users"],
    }),
    getAdminsMembers: builder.query({
      query: () => "/getAdmins&members",
      providesTags: ["Admins&Members"],
    }),
    getAllsubmissions: builder.query({
      query: () => "/getAllSubmission",
      providesTags: ["AllSubmissions"],
    }),
    getPendingsubmissions: builder.query({
      query: () => "/getPendingSubmission",
      providesTags: ["PendingSubmissions"],
    }),
    getSubmissionById: builder.query({
      query: (id) => `/GetSubmissionById?id=${id}`,
      providesTags: ['Submissions'],
    }),
    getNews: builder.query({
      query: () => "/getNews",
      providesTags: ["News"],
    }),
    getUserSubmissions: builder.query({
      query: (userId) => `/UserSubmission?id=${userId}`,
      providesTags : ["userSubmission"]
    }),
    getEventComments: builder.query({
      query: (event_id) => `/GetEventComments?id=${event_id}`,
      providesTags: ["eventComments"],
    }),
    getNewsComments: builder.query({
      query: (News_id) => `/GetNewsComments?id=${News_id}`,
      providesTags: ["NewsComments"],
    }),
    getSingleEvent: builder.query({
      query: (event_id) => `/singleEventData?id=${event_id}`,
      providesTags: ["EventRegister"]
    }),
    getSingleNews: builder.query({
      query: (id) => `/singleNewsData?id=${id}`
    }),
    getRegistration: builder.query({
      query: (id) => `Registration?id=${id}`,
      providesTags: ["Registration"]
    }),
    getAllRegistration: builder.query({
      query: (id) => `/AllRegistration?id=${id}`,
      providesTags: ["AllRegistrations"]
    }),
    Login: builder.mutation({
      query: (credentials) => ({
        url: "/Login",
        method: "POST",
        body: credentials,
      }),
    }),
    Register: builder.mutation({
      query: (credentials) => ({
        url: "/Register",
        method: "POST",
        body: credentials,
      }),
    }),
    DeleteEvent: builder.mutation({
      query: (credentials) => ({
        url: "/DeleteEvent",
        method: "DELETE",
        body: credentials,
      }),
      invalidatesTags: ["Events"],
    }),
    DeleteNews: builder.mutation({
      query: (credentials) => ({
        url: "/DeleteNews",
        method: "DELETE",
        body: credentials,
      }),
      invalidatesTags: ["News"],
    }),
    Submit: builder.mutation({
      query: (credentials) => ({
        url: "/Submission",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags : ["userSubmission"]
    }),
    approveSubmission: builder.mutation({
      query: (id) => ({
        url: "/ApproveSubmission",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["PendingSubmissions", "AllSubmissions","Submissions"],
    }),
    rejectSubmission: builder.mutation({
      query: (id) => ({
        url: "/rejectSubmision",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["PendingSubmissions", "AllSubmissions","Submissions"],
    }),
    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: "/CreateEvent",
        method: "POST",
        body: newEvent
      }),
      invalidatesTags: ["Events"]
    }),
    PromoteUser: builder.mutation({
      query: (id) => ({
        url: "/PromoteUser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Users", "Admins&Members"],
    }),
    DemoteUser: builder.mutation({
      query: (id) => ({
        url: "/DemoteUser",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Users", "Admins&Members"],
    }),
    PromoteToAdmin: builder.mutation({
      query: (id) => ({
        url: "/PromoteToAdmin",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Users", "Admins&Members"],
    }),
    CommentOnEvent: builder.mutation({
      query: (credentials) => ({
        url: "/CommentOnEvent",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["eventComments"],
    }),
    DeleteEventComment: builder.mutation({
      query: (id) => ({
        url: `DeleteEventComment?id=${id}`,
        method: "DELETE",
        body: { id }
      }),
      invalidatesTags: ["eventComments"]
    }),
    DeleteNewsComment: builder.mutation({
      query: (id) => ({
        url: `DeleteNewsComment?id=${id}`,
        method: "DELETE",
        body: { id }
      }),
      invalidatesTags: ["NewsComments"]
    }),
    CommentOnNews: builder.mutation({
      query: (credentials) => ({
        url: "/CommentOnNews",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["NewsComments"]
    }),
    registerUserForEvent: builder.mutation({
      query: (credentials) => ({
        url: '/registerForEvent',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["Registration", "AllRegistrations", "EventRegister"]
    }),

    unregisterUserFromEvent: builder.mutation({
      query: (credentials) => ({
        url: '/unRegister',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["Registration", "AllRegistrations", "EventRegister"]
    }),
    editEvent: builder.mutation({
      query: (updatedEvent) => ({
        url: "/EditEvent",
        method: "PUT",
        body: updatedEvent
      }),
      invalidatesTags: ["Events"],
    }),
    editNews: builder.mutation({
      query: (updatedNews) => ({
        url: "/EditNews",
        method: "PUT",
        body: updatedNews
      }),
      invalidatesTags: ["News"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateUser?id=${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    getUser: builder.query({
      query: (id) => `/getUser?id=${id}`,
      providesTags: ["CurrentUser"],
    }),
  }),


});

export const {
  useGetEventsQuery,
  useGetNewsQuery,
  useGetUserSubmissionsQuery,
  useGetUsersQuery,
  useGetSingleEventQuery,
  useLoginMutation,
  useRegisterMutation,
  useDeleteNewsMutation,
  useSubmitMutation,
  useDeleteEventMutation,
  useGetPendingsubmissionsQuery,
  useGetAllsubmissionsQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
  useDemoteUserMutation,
  usePromoteToAdminMutation,
  usePromoteUserMutation,
  useGetAdminsMembersQuery,
  useGetEventCommentsQuery,
  useGetNewsCommentsQuery,
  useCommentOnEventMutation,
  useRegisterUserForEventMutation,
  useUnregisterUserFromEventMutation,
  useGetRegistrationQuery,
  useGetAllRegistrationQuery,
  useGetSingleNewsQuery,
  useCommentOnNewsMutation,
  useDeleteEventCommentMutation,
  useDeleteNewsCommentMutation,
  useEditEventMutation,
  useEditNewsMutation,
  useCreateEventMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetSubmissionByIdQuery 
} = ApiSlice;

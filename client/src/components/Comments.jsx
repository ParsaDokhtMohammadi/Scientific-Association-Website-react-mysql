import React from 'react'
import { useGetEventCommentsQuery } from '../services/ApiSlice'
const Comments = ({event_id}) => {

    const {data:comments,isLoading} = useGetEventCommentsQuery(event_id)
    console.log(comments) 
  return (
    <div>Comments</div>
  )
}

export default Comments
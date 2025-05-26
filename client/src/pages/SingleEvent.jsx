import React from 'react'
import Comments from '../components/Comments'
import { useParams } from 'react-router'
const SingleEvent = () => {
    const {id} = useParams()
    return (
    <>
    <h1>hello event</h1>
    <Comments event_id={id}></Comments>
    </>
  )
}

export default SingleEvent
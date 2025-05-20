import React from 'react'
import { useGetEventsQuery } from '../services/ApiSlice'
const Events = () => {
   const {data:Events , isLoading , error} = useGetEventsQuery()
    console.log(Events)
  return (
    <div>Events</div>
  )
}

export default Events
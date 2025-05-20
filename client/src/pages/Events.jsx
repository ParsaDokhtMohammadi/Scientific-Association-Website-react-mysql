import React from 'react'
import { useGetEventsQuery } from '../services/ApiSlice'
import EventCard from '../components/EventCard'
const Events = () => {
   const {data:Events , isLoading , error} = useGetEventsQuery()
    console.log(Events)
  return (
    <div className='flex flex-wrap gap-4 justify-center'>
        {Events?.data.map(Event=>(
          <EventCard Event={Event}></EventCard>
        ))}
    </div>
  )
}

export default Events
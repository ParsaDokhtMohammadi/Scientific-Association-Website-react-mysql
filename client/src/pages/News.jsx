import React from 'react'
import { useGetNewsQuery } from '../services/ApiSlice'
import EventCard from '../components/EventCard'
const News = () => {
   const {data:News , isLoading , error} = useGetNewsQuery()
    console.log(Events)
  return (
    <div className='flex flex-wrap gap-4 justify-center p-8'>
        {News?.data.map(Item=>(
          <EventCard Event={Item}></EventCard>
        ))}
    </div>
  )
}

export default News
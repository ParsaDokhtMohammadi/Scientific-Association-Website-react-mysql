import React from 'react'
import { useSelector } from 'react-redux'
const EventCard = (Event) => {
    const User = useSelector(state => state.CurrentUser.CurrentUser)
    return (
    <div className='flex flex-col gap-2 p-2 bg-[#3B82F6] w-fit rounded md:max-w-[320px]'>
        <img src={Event.Event.img_path} alt=""  className='md:w-[300px]  rounded'/>
        <h2 className='text-2xl px-2 truncate'>{Event.Event.title}</h2>
        <p className='h-[75px] line-clamp-3 px-2 '>{Event.Event.description}</p>
        <span className='px-2 '>presented by {Event.Event.presenter}</span>
        <div className='flex justify-between px-2'>
            <button className='rounded  h-9  px-5  flex justify-center items-center duration-200 bg-red-400 hover:bg-red-600 cursor-pointer min-w-[86px]'>details</button>
            <button className={`rounded  h-9  px-5  flex justify-center items-center duration-200 bg-red-400 hover:bg-red-600  cursor-pointer min-w-[86px]
                ${User?.role !=="admin" ?"hidden":"block"}`}>edit</button>
            <button className={`rounded  h-9  px-5  flex justify-center items-center duration-200 bg-red-400 hover:bg-red-600 cursor-pointer min-w-[86px]
                ${User?.role !=="admin" ?"hidden":"block"}`}>delete</button>
        </div>
    </div>
  )
}

export default EventCard
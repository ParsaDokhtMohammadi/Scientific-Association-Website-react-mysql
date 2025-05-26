import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DeletePopup from './DeletePopup'
import { useNavigate } from 'react-router'

const EventCard = ({Item , tag}) => {
    const navigate = useNavigate()
    const User = useSelector(state => state.CurrentUser.CurrentUser) 
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    console.log(Item)
    return (
        <>
            <div className='flex flex-col gap-2 p-2 bg-[#1A1A1A] w-fit rounded text-[#F5F5F5] md:max-w-[320px] max-w-[370px]'>
                <img src={Item?.img_path} alt="" className='md:w-[300px] rounded' />
                <h2 className='text-2xl px-2 truncate'>{Item?.title}</h2>
                <p className='h-[75px] line-clamp-3 px-2 text-[#A3A3A3]'>{tag==="Event" ? Item?.description : Item?.content}</p>
                <span className='px-2 text-sm text-[#A3A3A3]'>{tag==="Event" ? `presented by ${Item?.presenter}` : `author : ${Item?.user_name}`}</span>
                <div className='flex justify-between px-2 not-md:px-8'>
                    <button className='rounded h-9 px-5 flex justify-center items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer min-w-[86px]'
                    onClick={()=>navigate(`/SingleEvent/${Item?.id}`)}>
                        details
                    </button>
                    <button className={`rounded h-9 px-5 flex justify-center items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer min-w-[86px]
                        ${User?.role !== "admin" ? "hidden" : "block"}`}>
                        edit
                    </button>
                    <button className={`rounded h-9 px-5 flex justify-center items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer min-w-[86px]
                        ${User?.role !== "admin" ? "hidden" : "block"}`}
                        onClick={() => setShowDeletePopup(true)}>
                        delete
                    </button>
                </div>
            </div>

            {showDeletePopup && (
                <div className="fixed inset-0 bg-[#000000b0] flex justify-center items-center z-50">
                    <DeletePopup onClose={() => setShowDeletePopup(false)} Id={Item.id} tag={tag} />
                </div>
            )}
        </>
    )
}

export default EventCard

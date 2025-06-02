import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DeletePopup from './DeletePopup'
import { useNavigate } from 'react-router'

const EventCard = ({ Item, tag }) => {
    const navigate = useNavigate();
    const User = useSelector(state => state.CurrentUser.CurrentUser);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    return (
        <>
            <div className="max-w-md rounded-2xl overflow-hidden shadow-lg bg-[#2A2A2A] text-[#F5F5F5] p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4">
                <img
                    src={`http://localhost:5000${Item?.img_path}`}
                    alt={Item?.title}
                    className="w-full h-48 object-cover rounded-lg md:w-[300px]"
                />
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-[#06B6D4] truncate w-[300px]">
                        {Item?.title}
                    </h2>
                    <p className="text-md text-[#A3A3A3]">
                        <span className="font-medium text-[#06B6D4]">
                            {tag === "Event" ? "Presenter:" : "Author:"}
                        </span>{" "}
                        {tag === "Event" ? Item?.presenter : Item?.user_name}
                    </p>
                    {tag === "Event" && (
                        <p className="text-sm text-[#A3A3A3]">
                            <span className="font-medium text-[#06B6D4]">Date:</span>{" "}
                            {new Date(Item?.date).toLocaleString()}
                        </p>
                    )}
                    <p className="text-sm text-[#C4C4C4] line-clamp-3 max-w-[300px]">
                        {tag === "Event" ? Item?.description : Item?.content}
                    </p>
                    <div className="flex justify-between gap-2 mt-2">
                        <button
                            className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer"
                            onClick={tag === "Event" ? () => navigate(`/SingleEvent/${Item?.id}`) : () => navigate(`/SingleNews/${Item?.id}`)}
                        >
                            Details
                        </button>
                        {User?.role === "admin" && (
                            <>
                                <button
                                    className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer"
                                    onClick={tag === "Event" ? () => navigate(`/EditEventForm/${Item?.id}`) : () => navigate(`/EditNewsForm/${Item?.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer"
                                    onClick={() => setShowDeletePopup(true)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showDeletePopup && (
                <div className="fixed inset-0 bg-[#000000b0] flex justify-center items-center z-50">
                    <DeletePopup onClose={() => setShowDeletePopup(false)} Id={Item.id} tag={tag} />
                </div>
            )}
        </>
    );
};

export default EventCard;

import React from "react";
import { useGetEventsQuery } from "../services/ApiSlice";
import EventCard from "../components/Card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Events = () => {
  const { data: Events, isLoading, error } = useGetEventsQuery();
  const user = useSelector((state) => state.CurrentUser.CurrentUser); 
  const navigate = useNavigate();

  return (
    <div className="p-8">
      {user?.role === "admin" && (
        <div className="mb-14 flex justify-end">
          <button
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md"
            onClick={() => navigate("/CreateEvent")}
          >
            Create Event
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {Events?.data?.length > 0 ? (
          Events.data.map((Item) => (
            <EventCard key={Item.id} Item={Item} tag={"Event"} />
          ))
        ) : (
          <p className="text-[#A3A3A3]">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;

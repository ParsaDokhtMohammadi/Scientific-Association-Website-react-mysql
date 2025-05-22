import React from "react";
import { useGetEventsQuery } from "../services/ApiSlice";
import EventCard from "../components/Card";
const Events = () => {
  const { data: Events, isLoading, error } = useGetEventsQuery();
 
  return (
    <div className="flex flex-wrap gap-4 justify-center p-8">
      {Events?.data.map((Item) => (
        <EventCard Item={Item} tag={"Event"}></EventCard>
      ))}
    </div>
  );
};

export default Events;

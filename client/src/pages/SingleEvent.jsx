import Comments from "../components/Comments";
import { useParams } from "react-router";
import {
  useGetSingleEventQuery,
  useRegisterUserForEventMutation,
  useUnregisterUserFromEventMutation,
  useGetRegistrationQuery,
} from "../services/ApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SingleEvent = () => {
  const User = useSelector((state) => state.CurrentUser.CurrentUser);

  useEffect(() => {
    if (!User) {
      navigate("/");
    }
  }, []);

  const user_id = User.id;
  const { id } = useParams();
  const event_id = parseInt(id);

  const {
    data: event,
    isLoading,
    error,
    refetch: refetchEvent,
  } = useGetSingleEventQuery(id);
  const [Register] = useRegisterUserForEventMutation();
  const [unRegister] = useUnregisterUserFromEventMutation();
  const { data: UserRegistration, refetch: refetchRegistration } =
    useGetRegistrationQuery(User.id);

  const checkRegistration = () => {
    return UserRegistration?.data.find((item) => item.event_id == id);
  };

  const handleClick = async () => {
    if (checkRegistration() === undefined) {
      await Register({ event_id, user_id });
    } else {
      await unRegister({ event_id, user_id });
    }
    await Promise.all([refetchEvent(), refetchRegistration()]);
  };

  if (isLoading)
    return <div className="text-[#06B6D4] font-medium">Loading...</div>;
  if (error)
    return (
      <div className="text-[#EF4444] font-medium">
        Error loading event data.
      </div>
    );

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 bg-[#1A1A1A] text-[#F5F5F5] rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-[#2A2A2A] shadow-md rounded-2xl p-6">
        <img
          src={`http://localhost:5000${event?.data[0]?.img_path}`}
          alt={event?.data[0].title || "Event"}
          className="w-full md:w-1/3 rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#06B6D4]">
            {event?.data[0].title}
          </h1>
          <p className="text-lg text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Presenter:</span>{" "}
            {event?.data[0].presenter}
          </p>
          <p className="text-md text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Date:</span>{" "}
            {new Date(event?.data[0].date).toLocaleString()}
          </p>
          <p className="text-md text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Capacity:</span>{" "}
            {event?.data[0].capacity}
          </p>
          <p className="text-md text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Created at:</span>{" "}
            {new Date(event?.data[0].created_at).toLocaleString()}
          </p>
          <p className="text-md text-[#C4C4C4] leading-relaxed">
            {event?.data[0].description}
          </p>
          <button
            className="bg-[#06B6D4] text-[#1A1A1A] font-bold py-2 px-4 rounded-md hover:bg-[#0891B2] transition-colors duration-200"
            onClick={handleClick}
            disabled={
              event?.data[0].capacity === 0 && checkRegistration() === undefined
            }
          >
            {checkRegistration() === undefined ? "Register" : "Unregister"}
          </button>
        </div>
      </div>

      <div className="bg-[#2A2A2A] shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-[#06B6D4] mb-4">Comments</h2>
        <Comments event_id={id} />
      </div>
    </div>
  );
};

export default SingleEvent;

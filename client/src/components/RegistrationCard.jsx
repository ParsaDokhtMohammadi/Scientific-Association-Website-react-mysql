import { useUnregisterUserFromEventMutation } from '../services/ApiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
const RegistrationCard = ({ data }) => {
  const User = useSelector(state => state.CurrentUser.CurrentUser);
  const user_id = User.id;
  const event_id = data.event_id;
  const [unRegister, { isLoading: isUnregistering }] = useUnregisterUserFromEventMutation();
  const navigate = useNavigate()


  return (
    <div className="max-w-md rounded-2xl overflow-hidden shadow-lg bg-[#2A2A2A] text-[#F5F5F5] p-6 hover:shadow-2xl transition-shadow duration-300">
      <img
        className="w-full h-48 object-cover rounded-lg md:w-[300px]"
        src={`http://localhost:5000${data?.img_path}`}
        alt={data.title}
      />
      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#06B6D4] cursor-pointer"
        onClick={()=>navigate(`/SingleEvent/${event_id}`)}>{data.title}</h2>
        <p className="text-md text-[#A3A3A3]">
          <span className="font-medium text-[#06B6D4]">Presenter:</span> {data.presenter}
        </p>
        <p className="text-sm text-[#A3A3A3]">
          <span className="font-medium text-[#06B6D4]">Date:</span> {new Date(data.date).toLocaleString()}
        </p>
        <p className="text-sm text-[#A3A3A3]">
          <span className="font-medium text-[#06B6D4]">Created at:</span> {new Date(data.created_at).toLocaleString()}
        </p>
        <p className="text-sm text-[#C4C4C4] leading-relaxed">{data.description}</p>
        
        <button
          className="mt-4 bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          onClick={()=>unRegister({ event_id, user_id })}
          disabled={isUnregistering}
        >
          {isUnregistering ? 'Unregistering...' : 'Unregister'}
        </button>
      </div>
    </div>
  );
};

export default RegistrationCard;

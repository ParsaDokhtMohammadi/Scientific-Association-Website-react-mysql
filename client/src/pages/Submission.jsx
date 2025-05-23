import { useState } from 'react';
import { useSubmitMutation ,useGetUserSubmissionsQuery} from '../services/ApiSlice';
import { useSelector } from 'react-redux';
const Submission = () => {
  const User = useSelector(state=>state.CurrentUser.CurrentUser)
  const [user_id, setUserId] = useState(User.id);
  const {data:userSubmissions} = useGetUserSubmissionsQuery(user_id)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submit, { isLoading, isError, error }] = useSubmitMutation();
  console.log(userSubmissions)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submit({ user_id, title, content }).unwrap();
      alert('Submission successful!');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <>
    <div className="max-w-[900px] mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Submit Article</h2>
      {isError && (
        <p className="text-red-500 mb-2">
          {error?.data?.error || 'Submission failed'}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className='text-2xl ml-2'>title</h3>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
          />
        <h3 className='text-2xl ml-2'>content</h3>
        <textarea
          value={content}
          placeholder="Content"
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded h-52"
          />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    <div className="flex flex-col gap-4 p-4 mx-auto max-w-[900px] border mt-4 rounded">
  {userSubmissions?.data?.map((subs) => (
    <div key={subs.id} className="flex flex-row gap-4 border rounded p-4 items-center">
      <img
        src={subs.img_path}
        alt="img"
        className="w-40 h-auto rounded object-cover "
      />
      <div className="flex flex-col w-[500px] h-[124px]">
        <h2 className="text-2xl font-semibold mb-2">{subs.title}</h2>
        <p className="text-base text-gray-500 break-words line-clamp-3">{subs.content}</p>
      </div>
      <div className='p-2 rounded border h-10 flex justify-center items-center'>{subs.status}</div>
    </div>
  ))}
</div>

          </>
  );
};

export default Submission;

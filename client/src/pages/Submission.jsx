import { useState } from 'react';
import { useSubmitMutation } from '../services/ApiSlice';
import { useSelector } from 'react-redux';
const Submission = () => {
  const User = useSelector(state=>state.CurrentUser.CurrentUser)
  const [user_id, setUserId] = useState(User.id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submit, { isLoading, isError, error }] = useSubmitMutation();
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
    <div className="max-w-[800px] mx-auto mt-10 p-4 border rounded shadow">
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
  );
};

export default Submission;

import { useState } from 'react';
import { useSubmitMutation, useGetUserSubmissionsQuery } from '../services/ApiSlice';
import { useSelector } from 'react-redux';

const Submission = () => {
  const User = useSelector(state => state.CurrentUser.CurrentUser);
  const [user_id] = useState(User.id);
  const { data: userSubmissions } = useGetUserSubmissionsQuery(user_id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // NEW: preview state
  const [submit, { isLoading, isError, error }] = useSubmitMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    try {
      await submit(formData).unwrap();
      alert('Submission successful!');
      setTitle('');
      setContent('');
      setImage(null);
      setPreviewUrl(null); // Clear preview after submission
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <div className="max-w-[900px] mx-auto mt-10 p-6 bg-[#1A1A1A] text-[#F5F5F5] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Submit Article</h2>
        {isError && (
          <p className="text-red-500 mb-2">
            {error?.data?.error || 'Submission failed'}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded bg-[#333] text-[#F5F5F5]"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Content</label>
            <textarea
              value={content}
              placeholder="Content"
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-2 border rounded h-40 bg-[#333] text-[#F5F5F5]"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange} // Updated handler
              className="w-full p-2 border rounded bg-[#333] text-[#F5F5F5]"
            />
            {/* Preview image */}
            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-[#A3A3A3]">Image Preview:</p>
                <img src={previewUrl} alt="Preview" className="w-40 rounded object-cover" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4 p-6 mx-auto max-w-[900px] bg-[#1A1A1A] rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Your Submissions</h2>
        {userSubmissions?.data?.map((subs) => (
          <div key={subs.id} className="flex flex-row gap-4 border rounded p-4 items-center bg-[#333] text-[#F5F5F5]">
            <img
              src={`http://localhost:5000${subs.img_path}`}
              alt="img"
              className="w-40 rounded object-cover h-[120px]"
            />
            <div className="flex flex-col w-[500px] h-[124px]">
              <h2 className="text-2xl font-semibold mb-2">{subs.title}</h2>
              <p className="text-base text-gray-300 break-words line-clamp-3">{subs.content}</p>
            </div>
            <div className={`p-2 rounded border h-10 flex justify-center items-center ${subs.status === 'approved' ? 'text-green-400' : subs.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
              {subs.status}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Submission;

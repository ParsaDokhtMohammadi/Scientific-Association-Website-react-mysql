import { useState } from "react";
import {
  useSubmitMutation,
  useGetUserSubmissionsQuery,
  useDeleteSubmissionMutation,
} from "../services/ApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Submission = () => {
  const User = useSelector((state) => state.CurrentUser.CurrentUser);
  const navigate = useNavigate()
    useEffect(() => {
      if (!User) {
        navigate("/");
      }
    }, []);
  const [user_id] = useState(User?.id);
  const { data: userSubmissions } = useGetUserSubmissionsQuery(user_id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submit, { isLoading, isError, error }] = useSubmitMutation();
  const [deleteSub, {}] = useDeleteSubmissionMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await submit(formData).unwrap();
      alert("Submission successful!");
      setTitle("");
      setContent("");
      setImage(null);
      setPreviewUrl(null);
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
            {error?.data?.error || "Submission failed"}
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
              onChange={handleImageChange}
              className="w-full p-2 border rounded bg-[#333] text-[#F5F5F5]"
            />

            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-[#A3A3A3]">Image Preview:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-40 rounded object-cover"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4 p-6 mx-auto max-w-[900px] bg-[#1A1A1A] rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">
          Your Submissions
        </h2>
        {userSubmissions?.data?.map((subs) => (
          <div
            key={subs.id}
            className="flex flex-row gap-4 border rounded p-4 items-center bg-[#333] text-[#F5F5F5]"
          >
            <img
              src={`http://localhost:5000${subs.img_path}`}
              alt="img"
              className="w-40 rounded object-cover h-[120px]"
            />
            <div className="flex flex-col w-[500px] h-[124px]">
              <h2 className="text-2xl font-semibold mb-2">{subs.title}</h2>
              <p className="text-base text-gray-300 break-words line-clamp-3">
                {subs.content}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 w-40">

              <div
                className={`w-full text-center px-3 py-2 rounded-md border font-medium text-sm shadow-sm
      ${
        subs.status === "approved"
          ? "border-green-400 bg-green-50 text-green-700"
          : subs.status === "rejected"
          ? "border-red-400 bg-red-50 text-red-700"
          : "border-yellow-400 bg-yellow-50 text-yellow-700"
      }`}
              >
                {subs.status}
              </div>
              <button
                onClick={() => deleteSub(subs.id)}
                className={`px-4 py-1 w-full font-medium rounded ${subs.status!=="pending" ?"hidden":"block"} bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D0D0D] shadow`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Submission;

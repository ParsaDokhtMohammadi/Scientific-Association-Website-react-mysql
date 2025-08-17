import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateNewsMutation } from "../services/ApiSlice";
import { useNavigate } from "react-router";
import { useEffect } from "react";
const CreateNews = () => {

  const User = useSelector(state => state.CurrentUser.CurrentUser);
    const navigate = useNavigate();
    useEffect(() => {
      if (!User) {
        navigate("/");
      }
      else if(User?.role!=="admin"){
        navigate("/Events")
      }
    }, []);
  const author_id = parseInt(User?.id) 
  const [form, setForm] = useState({
    title: "",
    content: ""
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [createNews , {}] = useCreateNewsMutation()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("author_id", author_id);
    if (image) {
      formData.append("img", image);
    }

   try{
    await createNews(formData).unwrap()
    alert ("news created successfully")
    setForm({
        title : "",
        content : ""
    })
    setImage(null)
   }
   catch(err){
    console.log(err)
   }
   setIsLoading(false)

  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#1A1A1A] rounded-lg shadow-lg text-[#F5F5F5]">
      <h2 className="text-2xl font-bold text-[#06B6D4] mb-4">Create News</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />

        <div>
          <label className="block text-lg font-medium mb-1">News Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded bg-[#333] text-[#F5F5F5]"
          />
          {image && (
            <div className="mt-2">
              <p>Selected Image:</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                className="w-40 h-auto rounded object-cover mt-1"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? "Creating..." : "Create News"}
        </button>

        {message && <p className="text-[#F5F5F5] mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default CreateNews;

import React, { useState } from "react";
import { useCreateEventMutation } from "../services/ApiSlice";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    presenter: "",
    capacity: "",
    created_at: new Date().toISOString()
  });
  const [image, setImage] = useState(null);
  const [createEvent, { isLoading, error }] = useCreateEventMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("presenter", form.presenter);
    formData.append("capacity", form.capacity);
    formData.append("created_at", form.created_at);
    if (image) {
      formData.append("image", image);
    }

    try {
      await createEvent(formData).unwrap();
      alert("Event created successfully!");
      setForm({
        title: "",
        description: "",
        date: "",
        presenter: "",
        capacity: "",
        created_at: new Date().toISOString()
      });
      setImage(null);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#1A1A1A] rounded-lg shadow-lg text-[#F5F5F5]">
      <h2 className="text-2xl font-bold text-[#06B6D4] mb-4">Create New Event</h2>
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
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <input
          name="presenter"
          value={form.presenter}
          onChange={handleChange}
          placeholder="Presenter"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <input
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        
        {/* Image Input */}
        <div>
          <label className="block text-lg font-medium mb-1">Event Image</label>
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
          {isLoading ? "Creating..." : "Create Event"}
        </button>
        {error && <p className="text-[#EF4444]">Error creating event.</p>}
      </form>
    </div>
  );
};

export default CreateEvent;

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
    const [createEvent, { isLoading, error }] = useCreateEventMutation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createEvent(form);
        setForm({
            title: "",
            description: "",
            date: "",
            presenter: "",
            capacity: "",
            created_at: new Date().toISOString()
        });
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
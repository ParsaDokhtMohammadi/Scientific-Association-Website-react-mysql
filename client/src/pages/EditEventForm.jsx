import React, { useState, useEffect } from 'react';
import { useEditEventMutation, useGetSingleEventQuery } from '../services/ApiSlice';
import { useParams } from 'react-router';

const EditEventForm = () => {
    const { id } = useParams();
    const { data: eventData, isLoading, error } = useGetSingleEventQuery(id);
    const [editEvent, { isLoading: isEditing }] = useEditEventMutation();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        capacity: '',
        presenter: '',
        img_path: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // For showing chosen image

    useEffect(() => {
        if (eventData?.data?.[0]) {
            const { title, description, date, capacity, presenter, img_path } = eventData.data[0];
            setFormData({ title, description, date, capacity, presenter, img_path });
        }
    }, [eventData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('id', id);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('capacity', formData.capacity);
        formDataToSend.append('presenter', formData.presenter);
        formDataToSend.append('img_path', formData.img_path);

        if (imageFile) {
            formDataToSend.append('img', imageFile);
        }

        try {
            await editEvent(formDataToSend).unwrap();
            alert("Event updated successfully!");
        } catch (err) {
            console.error("Error updating event:", err);
            alert("Failed to update event.");
        }
    };

    if (isLoading) return <p className="text-[#06B6D4]">Loading...</p>;
    if (error) return <p className="text-[#EF4444]">Error loading event.</p>;

    return (
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] text-[#F5F5F5] p-6 rounded-lg shadow-lg max-w-lg mx-auto flex flex-col gap-4" encType="multipart/form-data">
            <h2 className="text-2xl font-bold text-[#06B6D4]">Edit Event</h2>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="p-3 rounded-md bg-[#333] text-[#F5F5F5] placeholder-[#999]" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-3 rounded-md bg-[#333] text-[#F5F5F5] placeholder-[#999]" />
            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="p-3 rounded-md bg-[#333] text-[#F5F5F5]" />
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacity" required className="p-3 rounded-md bg-[#333] text-[#F5F5F5]" />
            <input type="text" name="presenter" value={formData.presenter} onChange={handleChange} placeholder="Presenter" required className="p-3 rounded-md bg-[#333] text-[#F5F5F5]" />

            {/* Show current image */}
            {formData.img_path && !previewImage && (
                <div>
                    <p>Current Image:</p>
                    <img src={`http://localhost:5000${formData.img_path}`} alt="Current" className="w-32 h-32 object-cover" />
                </div>
            )}

            {/* Show selected image preview */}
            {previewImage && (
                <div>
                    <p>Selected Image Preview:</p>
                    <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover" />
                </div>
            )}

            <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 rounded-md bg-[#333] text-[#F5F5F5]" />

            <button type="submit" disabled={isEditing} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200">
                {isEditing ? "Updating..." : "Update Event"}
            </button>
        </form>
    );
};

export default EditEventForm;

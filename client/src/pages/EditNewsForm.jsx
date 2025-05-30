import React, { useState, useEffect } from 'react';
import { useEditNewsMutation, useGetSingleNewsQuery } from '../services/ApiSlice';
import { useParams } from 'react-router';

const EditNewsForm = () => {
    const { id } = useParams();
    const { data: newsData, isLoading, error } = useGetSingleNewsQuery(id);
    const [editNews, { isLoading: isEditing }] = useEditNewsMutation();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        img_path: ''
    });

    useEffect(() => {
        if (newsData?.data?.[0]) {
            const { title, content, img_path } = newsData.data[0];
            setFormData({ title, content, img_path });
        }
    }, [newsData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await editNews({ id, ...formData });
        alert("News updated successfully!");
    };

    if (isLoading) return <p className="text-[#06B6D4]">Loading...</p>;
    if (error) return <p className="text-[#EF4444]">Error loading news.</p>;

    return (
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] text-[#F5F5F5] p-6 rounded-lg shadow-lg max-w-lg mx-auto flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-[#06B6D4]">Edit News</h2>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="p-3 rounded-md bg-[#333] text-[#F5F5F5] placeholder-[#999]"
            />
            <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Content"
                required
                className="p-3 rounded-md bg-[#333] text-[#F5F5F5] placeholder-[#999]"
            />
            <input
                type="text"
                name="img_path"
                value={formData.img_path}
                onChange={handleChange}
                placeholder="Image Path"
                required
                className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
            />
            <button
                type="submit"
                disabled={isEditing}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                {isEditing ? "Updating..." : "Update News"}
            </button>
        </form>
    );
};

export default EditNewsForm;

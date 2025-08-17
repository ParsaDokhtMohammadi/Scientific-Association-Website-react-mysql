import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserQuery, useUpdateUserMutation } from "../services/ApiSlice";
import { useNavigate } from "react-router";

const EditUserProfile = () => {
  const currentUser = useSelector((state) => state.CurrentUser.CurrentUser); // Replace with your user slice
  const navigate = useNavigate()  
  useEffect(() => {
      if (!currentUser) {
        navigate("/");
      }
    }, []);
  
  const userId = currentUser?.id;

  const { data: userData, isLoading } = useGetUserQuery(userId);
  const [updateUser, { isLoading: isUpdating, error }] = useUpdateUserMutation();

  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (userData?.data) {
      setForm({
        user_name: userData.data.user_name,
        email: userData.data.email,
        password: ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser({ id: userId, data: form });
    alert("Profile updated successfully!");
  };

  if (isLoading) return <p className="text-center text-[#A3A3A3]">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#1A1A1A] rounded-lg shadow-lg text-[#F5F5F5]">
      <h2 className="text-2xl font-bold text-[#06B6D4] mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="user_name"
          value={form.user_name}
          onChange={handleChange}
          placeholder="Username"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
          required
          className="p-3 rounded-md bg-[#333] text-[#F5F5F5]"
        />
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
        {error && <p className="text-[#EF4444]">Error updating profile.</p>}
      </form>
    </div>
  );
};

export default EditUserProfile;

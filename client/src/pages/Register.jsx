import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useRegisterMutation } from "../services/ApiSlice";

const Register = () => {
  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [register, { isLoading, isError, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ user_name, email, password }).unwrap();
      console.log('Register successful:', response);
      navigate("/");
    } catch (err) {
      console.error('Register failed:', err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A] text-[#F5F5F5]">
      <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-[#0D0D0D]">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#06B6D4]">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username:</label>
            <input
              type="text"
              value={user_name}
              placeholder='Username'
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#262626] text-[#F5F5F5] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#262626] text-[#F5F5F5] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-[#262626] text-[#F5F5F5] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            />
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className="w-full py-2 rounded bg-[#06B6D4] hover:bg-[#0891B2] text-[#0D0D0D] font-bold duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm mt-2">
              Error: {error?.data?.error || error.message}
            </p>
          )}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-[#06B6D4] hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

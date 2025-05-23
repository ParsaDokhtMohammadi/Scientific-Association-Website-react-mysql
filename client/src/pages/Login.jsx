import React, {useState} from 'react';
import {useLoginMutation} from '../services/ApiSlice';
import {useNavigate} from "react-router"
import {setUser} from '../features/UserSlice';
import {useDispatch} from 'react-redux';


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [user_name, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [login, { data, isLoading, isError, error }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ user_name, password }).unwrap();
      console.log('Login successful:', response);
      dispatch(setUser({id:response.user.id,user_name:response.user.user_name , role : response.user.role}))
      navigate("/UserDashboard")
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.data?.error || error.message}</p>}
    </div>
  );
};


export default Login
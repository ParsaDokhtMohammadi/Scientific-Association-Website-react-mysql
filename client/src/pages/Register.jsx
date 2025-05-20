import React ,{useState} from 'react'
import { useNavigate } from 'react-router'
import {useRegisterMutation} from "../services/ApiSlice"
const Register = () => {
  const [user_name , setUserName] = useState("")
  const [password , setPassword] = useState("")
  const [email , setEmail] = useState("")
  const [Register , {data , isLoading , isError , error}] = useRegisterMutation()
  const navigate = useNavigate()
  const handleRegister = async (e) =>{
    e.preventDefault()
    try {
          const response = await Register({ user_name, email, password , }).unwrap();
          console.log('register successful:', response);
          navigate("/Login")
        } catch (err) {
          console.error('register failed:', err);
        }
  }
  
    return (
    <>
        <form action="" onSubmit={handleRegister}>
            <input type="text"
            value={user_name} 
            placeholder='userName' 
            onChange={(e)=>setUserName(e.target.value)}
            required/>
            <input type="text"
            value={email} 
            placeholder='email' 
            onChange={(e)=>setEmail(e.target.value)}
            required/>
            <input type="password"
            value={password} 
            placeholder='password' 
            onChange={(e)=>setPassword(e.target.value)}
            required/>
            <button type='submit'>Register</button>
        </form>
        {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.data?.error || error.message}</p>}
    </>
  )
}

export default Register
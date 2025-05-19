import React from 'react'
import { useSelector } from 'react-redux'
const UserDashboard = () => {
  const User = useSelector(state => state.CurrentUser.CurrentUser)
  console.log(User)
  return (
    <div>UserDashboard</div>
  )
}

export default UserDashboard
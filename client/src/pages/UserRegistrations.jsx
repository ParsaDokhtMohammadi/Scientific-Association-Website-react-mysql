import React from 'react'
import { useGetAllRegistrationQuery } from '../services/ApiSlice'
import { useSelector } from 'react-redux'
import RegistrationCard from '../components/RegistrationCard'

const UserRegistrations = () => {
  const User = useSelector(state => state.CurrentUser.CurrentUser)
  const { data: Registrations } = useGetAllRegistrationQuery(User.id)

  return (
    <div className="flex flex-wrap gap-4 justify-center p-8">
      {Registrations?.data && Registrations.data.length === 0 ? (
        <span>No registrations yet</span>
      ) : (
        Registrations?.data?.map(datum => (
          <RegistrationCard key={datum.id} data={datum} />
        ))
      )}
    </div>
  )
}

export default UserRegistrations

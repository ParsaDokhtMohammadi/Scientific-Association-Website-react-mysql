import { useState } from 'react'
import {
  usePromoteToAdminMutation,
  useGetUsersQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
  useGetAdminsMembersQuery
} from '../services/ApiSlice'

const UsersAdmin = () => {
  const [view, SetView] = useState("users")
  const { data: AllUsers } = useGetUsersQuery()
  const { data: AdminMembers } = useGetAdminsMembersQuery()
  const [Promote] = usePromoteUserMutation()
  const [Demote] = useDemoteUserMutation()
  const [PromoteToAdmin] = usePromoteToAdminMutation()

  return (
    <>
      <div className='flex flex-col w-full mx-auto max-w-[80%] border rounded '>
        <div className={`flex flex-row items-center justify-around relative bg-[#1A1A1A] rounded-l rounded-r`}>
          <button className={`w-[50%] ${view === "users" ? "bg-[#1A1A1A] text-[#F5F5F5]  rounded-r-lg relative left-7" : "bg-[#A3A3A3] text-[#444] hover:bg-[#D4D4D4] hover:text-[#1A1A1A]"} py-4 cursor-pointer`}
            onClick={() => SetView("users")}
          >
            All users
          </button>
          <button className={`w-[50%] ${view === "members" ? "bg-[#1A1A1A] text-[#F5F5F5] rounded-l-lg relative right-7" : "bg-[#A3A3A3] text-[#444] hover:bg-[#D4D4D4] hover:text-[#1A1A1A]"} py-4 cursor-pointer`}
            onClick={() => SetView("members")}
          >
            admins and members
          </button>
        </div>

        {view === "users" && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className='border py-2 bg-sky-500'>user name</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>email</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>password</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>joined at</th>
                <th className='border py-2 bg-sky-500'>role</th>
                <th className='border py-2 bg-sky-500'>make admin</th>
                <th className='border py-2 bg-sky-500 '>member</th>
              </tr>
            </thead>
            <tbody>
              {AllUsers?.data.map(datum => (
                <tr key={datum.id}>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.user_name}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{datum?.email}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{datum?.password}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{(datum?.created_at).slice(0, 10)}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.role}</td>
                  <td className='border py-2 px-2 max-w-[200px] truncate'>
                    <button
                      className={`lg:w-[150px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 cursor-pointer 
                        ${datum?.role === "admin" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-[#06B6D4] hover:bg-[#0891B2] text-white"}`}
                      onClick={() => PromoteToAdmin(datum?.id)}
                      disabled={datum?.role === "admin"}
                    >
                      make admin
                    </button>
                  </td>
                  <td className='border py-2 px-2 max-w-[200px] truncate'>
                    <button className="lg:w-[150px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer"
                      onClick={datum?.role !== "user" ? () => Demote(datum?.id) : () => Promote(datum?.id)}
                    >{datum?.role !== "user" ? "demote" : "promote"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {view === "members" && (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className='border py-2 bg-sky-500'>user name</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>email</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>password</th>
                <th className='border py-2 bg-sky-500 not-lg:hidden'>joined at</th>
                <th className='border py-2 bg-sky-500'>role</th>
                <th className='border py-2 bg-sky-500'>make admin</th>
                <th className='border py-2 bg-sky-500 '>member</th>
              </tr>
            </thead>
            <tbody>
              {AdminMembers?.data.map(datum => (
                <tr key={datum.id}>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.user_name}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{datum?.email}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{datum?.password}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{(datum?.created_at).slice(0, 10)}</td>
                  <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.role}</td>
                  <td className='border py-2 px-2 max-w-[200px] truncate'>
                    <button
                      className={`lg:w-[150px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 cursor-pointer 
                        ${datum?.role === "admin" ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-[#06B6D4] hover:bg-[#0891B2] text-white"}`}
                      onClick={() => PromoteToAdmin(datum?.id)}
                      disabled={datum?.role === "admin"}
                    >
                      make admin
                    </button>
                  </td>
                  <td className='border py-2 px-2 max-w-[200px] truncate'>
                    <button className="lg:w-[150px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer"
                      onClick={datum?.role !== "user" ? () => Demote(datum?.id) : () => Promote(datum?.id)}
                    >{datum?.role !== "user" ? "demote" : "promote"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default UsersAdmin

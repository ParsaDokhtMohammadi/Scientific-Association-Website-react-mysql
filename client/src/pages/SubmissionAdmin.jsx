import {useState} from 'react'
import { useGetAllsubmissionsQuery , useGetPendingsubmissionsQuery ,useApproveSubmissionMutation , useRejectSubmissionMutation } from '../services/ApiSlice'
const SubmissionAdmin = () => {
  const {data:AllSubmissions , isLoading , Error} = useGetAllsubmissionsQuery()
  const {data:PendingSubmissions} = useGetPendingsubmissionsQuery()
  const [approveSubmission, {  isSuccess, isError }] = useApproveSubmissionMutation();
  const [rejectSubmission,{}] = useRejectSubmissionMutation()
  const [view , SetView] = useState("pending")
  return (
    <>
      <div className='flex flex-col  w-full mx-auto  max-w-[80%] border  rounded '>
        <div className={`flex flex-row items-center justify-around relative bg-[#1A1A1A] rounded-l rounded-r`}>
          <button className={`w-[50%] ${view==="pending" ?"bg-[#1A1A1A] text-[#F5F5F5]  rounded-r-4xl relative left-7" : "bg-[#A3A3A3] text-[#444] hover:bg-[#D4D4D4] hover:text-[#1A1A1A]"}
           py-4    cursor-pointer`}
           onClick={()=>SetView("pending")}
           >pending submissions</button>
          <button className={`w-[50%] ${view==="history" ?"bg-[#1A1A1A] text-[#F5F5F5] rounded-l-4xl relative right-7 " : "bg-[#A3A3A3] text-[#444] hover:bg-[#D4D4D4] hover:text-[#1A1A1A]"}
           py-4 rounded-rt   cursor-pointer`}
           onClick={()=>SetView("history")}
           >submission history</button>
        </div>
        {view === "pending" && (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className='border py-2 bg-sky-500'>title</th>
        <th className='border py-2 bg-sky-500'>content</th>
        <th className='border py-2 bg-sky-500'>user name</th>
        <th className='border py-2 bg-sky-500 not-lg:hidden'>submitted at</th>
        <th className='border py-2 bg-sky-500'>details</th>
        <th className='border py-2 bg-sky-500 not-lg:hidden'>approve</th>
        <th className='border py-2 bg-sky-500 not-lg:hidden'>reject</th>
      </tr>
    </thead>
    <tbody>
      {PendingSubmissions?.data.map(datum => (
        <tr key={datum.id}>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.title}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.content}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.user_name}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{(datum?.created_at).slice(0, 10)}</td>
          <td className='border py-2 px-2 max-w-[200px] truncate'>
            <button className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer">details</button>
          </td>
          <td className='border py-2 px-2 max-w-[200px] truncate not-lg:hidden'>
            <button className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer"
            onClick={()=>approveSubmission(datum?.id)}>approve</button>
          </td>
          <td className='border py-2 px-2 max-w-[200px] truncate not-lg:hidden'>
            <button className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer"
            onClick={()=>rejectSubmission(datum?.id)}
            >reject</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
  {view==="history" && (
      <table className="w-full border-collapse">
    <thead>
      <tr>
        <th className='border py-2 bg-sky-500'>title</th>
        <th className='border py-2 bg-sky-500 not-sm:hidden'>content</th>
        <th className='border py-2 bg-sky-500 not-lg:hidden'>user name</th>
        <th className='border py-2 bg-sky-500 not-lg:hidden'>submitted at</th>
        <th className='border py-2 bg-sky-500 not-md:hidden'>status</th>
        <th className='border py-2 bg-sky-500'>details</th>

      </tr>
    </thead>
    <tbody>
      {AllSubmissions?.data.map(datum => (
        <tr key={datum.id}>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate'>{datum?.title}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate not-sm:hidden'>{datum?.content}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{datum?.user_name}</td>
          <td className='border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden'>{(datum?.created_at).slice(0, 10)}</td>
          <td className={`border py-2 px-2 text-center max-w-[200px] truncate border-[#F5F5F5] not-md:hidden ${datum?.status === "approved" ?"text-green-400": datum?.status==="rejected" ?"text-red-500":""}`}>{datum?.status}</td>
          <td className='border py-2 px-2 max-w-[200px] truncate'>
            <button className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#0891B2] cursor-pointer">details</button>
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

export default SubmissionAdmin
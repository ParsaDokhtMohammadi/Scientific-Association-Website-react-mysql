import { useState } from "react";
import {
  useGetAllsubmissionsQuery,
  useGetPendingsubmissionsQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} from "../services/ApiSlice";
import { useNavigate } from "react-router";
const SubmissionAdmin = () => {
  const {
    data: AllSubmissions,
    isLoading,
    Error,
  } = useGetAllsubmissionsQuery();
  const { data: PendingSubmissions } = useGetPendingsubmissionsQuery();
  const [approveSubmission, { isSuccess, isError }] =
    useApproveSubmissionMutation();
  const [rejectSubmission, {}] = useRejectSubmissionMutation(); 
  const [view, SetView] = useState("pending");
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col w-full mx-auto max-w-[80%] border  rounded bg-[#1A1A1A]">
        <div
          className={`flex flex-row items-center justify-around relative bg-[#1A1A1A] rounded-l rounded-r`}
        >
          <button
            className={`w-[50%] ${
              view === "pending"
                ? "bg-[#1A1A1A] text-[#F5F5F5] rounded-r-4xl relative left-7"
                : "bg-[#A3A3A3] text-[#0D0D0D] hover:bg-[#F5F5F5] hover:text-[#0D0D0D]"
            }
           py-4 cursor-pointer`}
            onClick={() => SetView("pending")}
          >
            pending submissions
          </button>
          <button
            className={`w-[50%] ${
              view === "history"
                ? "bg-[#1A1A1A] text-[#F5F5F5] rounded-l-4xl relative right-7"
                : "bg-[#A3A3A3] text-[#0D0D0D] hover:bg-[#F5F5F5] hover:text-[#0D0D0D]"
            }
           py-4 cursor-pointer`}
            onClick={() => SetView("history")}
          >
            submission history
          </button>
        </div>
        {view === "pending" && (
          <table className="w-full border-collapse text-[#F5F5F5]">
            <thead>
              <tr>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D]">title</th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D] not-md:hidden">
                  content
                </th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D] not-md:hidden">
                  user name
                </th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D] not-lg:hidden">
                  submitted at
                </th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D]">details</th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D] not-lg:hidden">
                  approve
                </th>
                <th className="border py-2 bg-[#06B6D4] text-[#0D0D0D] not-lg:hidden">reject</th>
              </tr>
            </thead>
            <tbody>
              {PendingSubmissions?.data.map((datum) => (
                <tr key={datum.id}>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate">{datum?.title}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-md:hidden">{datum?.content}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-md:hidden">{datum?.user_name}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden">{datum?.created_at.slice(0, 10)}</td>
                  <td className="border py-2 px-2 max-w-[200px] truncate">
                    <button
                      className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#A3A3A3] text-[#0D0D0D] cursor-pointer"
                      onClick={() => navigate(`/SingleSubmissionPreview/${datum?.id}`)}
                    >
                      details
                    </button>
                  </td>
                  <td className="border py-2 px-2 max-w-[200px] truncate not-lg:hidden">
                    <button
                      className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#A3A3A3] text-[#0D0D0D] cursor-pointer"
                      onClick={() => approveSubmission(datum?.id)}
                    >
                      approve
                    </button>
                  </td>
                  <td className="border py-2 px-2 max-w-[200px] truncate not-lg:hidden">
                    <button
                      className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#A3A3A3] text-[#0D0D0D] cursor-pointer"
                      onClick={() => rejectSubmission(datum?.id)}
                    >
                      reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {view === "history" && (
          <table className="w-full border-collapse text-[#F5F5F5]">
            <thead>
              <tr>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D]">title</th>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D] not-sm:hidden">
                  content
                </th>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D] not-lg:hidden">
                  user name
                </th>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D] not-lg:hidden">
                  submitted at
                </th>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D] not-md:hidden">status</th>
                <th className="border border-[#F5F5F5] py-2 bg-[#06B6D4] text-[#0D0D0D]">details</th>
              </tr>
            </thead>
            <tbody>
              {AllSubmissions?.data.map((datum) => (
                <tr key={datum.id}>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate">{datum?.title}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-sm:hidden">{datum?.content}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden">{datum?.user_name}</td>
                  <td className="border py-2 px-2 text-center max-w-[200px] truncate not-lg:hidden">{datum?.created_at.slice(0, 10)}</td>
                  <td className={`border border-[#F5F5F5] py-2 px-2 text-center max-w-[200px] truncate not-md:hidden ${
                    datum?.status === "approved" ? "text-green-400" :
                    datum?.status === "rejected" ? "text-red-500" : "text-[#A3A3A3]"
                  }`}>{datum?.status}</td>
                  <td className="border py-2 px-2 max-w-[200px] truncate">
                    <button
                      className="lg:w-[86px] rounded h-9 px-2 flex justify-center m-auto items-center duration-200 bg-[#06B6D4] hover:bg-[#A3A3A3] text-[#0D0D0D] cursor-pointer"
                      onClick={() => navigate(`/SingleSubmissionPreview/${datum?.id}`)}
                    >
                      details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default SubmissionAdmin;

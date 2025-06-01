import React from "react";
import { useParams } from "react-router";
import {
  useGetSubmissionByIdQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} from "../services/ApiSlice";

const SingleSubmissionPreview = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetSubmissionByIdQuery(id);
  const [approveSubmission] = useApproveSubmissionMutation();
  const [rejectSubmission] = useRejectSubmissionMutation();

  if (isLoading) return <p>Loading submission...</p>;
  if (error) return <p>Error loading submission.</p>;

  const submission = data?.data;


  return (
    <div className="max-w-[800px] mx-auto p-6 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{submission?.title}</h2>
      <p className="text-sm mb-2 text-[#A3A3A3]">
        By {submission?.user_name} |{" "}
        {new Date(submission?.created_at).toLocaleDateString()}
      </p>
      <img
        src={submission?.img_path}
        alt="Submission"
        className="w-full max-h-[300px] object-cover rounded-md mb-4"
      />
      <p>{submission?.content}</p>
      <p
        className={`mt-2 text-sm font-semibold ${
          submission?.status === "approved"
            ? "text-green-500"
            : submission?.status === "rejected"
            ? "text-red-500"
            : "text-yellow-500"
        }`}
      >
        Status: {submission?.status}
      </p>
      {submission?.status === "pending" && (
        <div className="mt-4 flex gap-4">
          <button
            onClick={async()=> await approveSubmission(submission.id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Approve
          </button>
          <button
            onClick={async()=>await rejectSubmission(submission.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleSubmissionPreview;

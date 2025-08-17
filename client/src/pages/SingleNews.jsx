import React from "react";
import { useParams } from "react-router";
import { useGetSingleNewsQuery } from "../services/ApiSlice"; 
import { useSelector } from "react-redux";
import CommentsNews from "../components/CommentsNews";
import { useEffect } from "react";

const SingleNews = () => {
  const { id } = useParams();
  const { data: news, isLoading, error } = useGetSingleNewsQuery(id);
  
    const User = useSelector((state) => state.CurrentUser.CurrentUser);
    useEffect(() => {
      if (!User) {
        navigate("/");
      }
    }, []);

  if (isLoading) return <div className="text-[#06B6D4] font-medium">Loading...</div>;
  if (error) return <div className="text-[#EF4444] font-medium">Error loading news data.</div>;

  const newsData = news?.data[0];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 bg-[#1A1A1A] text-[#F5F5F5] rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-[#2A2A2A] shadow-md rounded-2xl p-6">
        <img
          src={`http://localhost:5000${newsData?.img_path}`}
          alt={newsData?.title || "News"}
          className="w-full md:w-1/3 rounded-2xl object-cover h-[250px]"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#06B6D4]">{newsData?.title}</h1>
          <p className="text-lg text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Author:</span> {newsData?.user_name}
          </p>
          <p className="text-md text-[#A3A3A3]">
            <span className="font-medium text-[#06B6D4]">Created at:</span>{" "}
            {new Date(newsData?.created_at).toLocaleString()}
          </p>
          <p className="text-md text-[#C4C4C4] leading-relaxed">{newsData?.content}</p>
        </div>
      </div>
      <div className="bg-[#2A2A2A] shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-[#06B6D4] mb-4">Comments</h2>
        <CommentsNews id={id} />
      </div>
    </div>
  );
};

export default SingleNews;

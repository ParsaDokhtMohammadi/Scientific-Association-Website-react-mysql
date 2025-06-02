import React from "react";
import { useGetNewsQuery } from "../services/ApiSlice";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
const News = () => {
  const { data: News, isLoading, error } = useGetNewsQuery();
  const user = useSelector((state) => state.CurrentUser.CurrentUser); 
  const navigate = useNavigate();

  return (
    <div className="p-8">
      {user?.role !== "user" && (
        <div className="mb-14 flex justify-end">
          <button
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#1A1A1A] font-bold py-2 px-4 rounded-md"
            onClick={() => navigate("/CreateNews")}
          >
            Create News
          </button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 justify-center">
        {News?.data?.length > 0 ?(
          News?.data.map((Item) => (
        <Card Item={Item} tag={"News"}></Card>
        ))
        ) : (<p className="text-[#A3A3A3]">No news available.</p>)}
      </div>
    </div>
  );
};

export default News;

      
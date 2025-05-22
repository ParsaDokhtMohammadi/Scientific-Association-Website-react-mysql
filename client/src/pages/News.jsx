import React from "react";
import { useGetNewsQuery } from "../services/ApiSlice";
import Card from "../components/Card";
const News = () => {
  const { data: News, isLoading, error } = useGetNewsQuery();
  console.log(News)
  return (
    <div className="flex flex-wrap gap-4 justify-center p-8">
      {News?.data.map((Item) => (
        <Card Item={Item} tag={"News"}></Card>
      ))}
    </div>
  );
};

export default News;

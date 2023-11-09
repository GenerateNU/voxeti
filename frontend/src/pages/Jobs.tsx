import { Divider } from "@mui/material";
import OrderItem from "../components/JobCard/JobCard";
import { jobApi } from "../api/api";
import { useStateSelector } from "../hooks/use-redux";
import { Job } from "../main.types";
import { useState, useEffect } from "react";

export default function Jobs() {
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const { user } = useStateSelector((state) => state.user);

  const { data: data } = jobApi.useGetDesignerJobsQuery({
    designerId: user.id,
    page: "0",
  });

  useEffect(() => {
    if (data) {
      setUserJobs(data);
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center w-[75%] xl:w-[60%] mx-auto">
      <div className="text-left w-full py-10">
        <h1 className="text-4xl font-bold py-5">Job Requests</h1>
        <Divider />
      </div>
      {/* <StatusBox status={Status.InProgress} /> */}
      {userJobs.length > 0 ? (
        userJobs.map((job) => <OrderItem job={job} />)
      ) : (
        <p>No jobs {user.id}</p>
      )}
    </div>
  );
}

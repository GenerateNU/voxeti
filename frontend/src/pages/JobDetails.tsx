import { useParams } from "@tanstack/react-router";
import OrderInformationPage from "../components/OrderInfoPage/OrderInfoPage";
import OrderStatus from "../components/OrderStatus/OrderStatus";
import { useStateSelector } from "../hooks/use-redux";
import { useEffect, useState } from "react";
import { Job } from "../main.types";
import { jobApi } from "../api/api";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useStateSelector((state) => state.user);
  const [currentJob, setCurrentJob] = useState<Job>({} as Job);

  const { data: data } = jobApi.useGetJobQuery(id as string);

  
  useEffect(() => {
    if (data && data.designerId === user.id) {
      setCurrentJob(data);
    } 
  }, [data, user.id]);

  if (!currentJob.id) {
    return <p>Job unavailable</p>;
  }
  return (
    <div className="flex flex-col justify-center items-center w-[75%] xl:w-[60%] mx-auto">
      <OrderStatus job={currentJob} />
      <OrderInformationPage job={currentJob} />
    </div>
  )
}
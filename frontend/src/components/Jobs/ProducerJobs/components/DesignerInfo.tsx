import { userApi } from "../../../../api/api";
import { Job } from "../../../../main.types";
import { Avatar } from "@mui/material";
import JobAcceptButtons from "./JobAcceptButtons";

export default function DesignerName(props: { job: Job }) {
  const { data: data } = userApi.useGetUserQuery(props.job.designerId);
  return (
    <div className=" flex flex-col w-full">
      <div className=" flex flex-row items-center justify-between w-full">
        <div className=" flex flex-row">
          <Avatar
            className=" outline outline-3 outline-offset-2 outline-designer"
            alt={data ? `${data.firstName} ${data.lastName}` : ""}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 64, height: 64 }}
          />
          <div className=" px-4">
            <p className=" text-lg font-medium">
              {data && data.firstName} {data && data.lastName}
            </p>
            <p className=" text-sm">Designer</p>
          </div>
        </div>
        {props.job && <JobAcceptButtons currentJob={props.job} />}
      </div>
    </div>
  );
}

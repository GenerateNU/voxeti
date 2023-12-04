import { userApi } from "../../../../api/api";
import { Job } from "../../../../main.types";
import { Avatar } from "@mui/material";
import JobAcceptButtons from "./JobAcceptButtons";

function capitalize(str?: string) {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";
}

export default function DesignerName(props: { designerId: string; job?: Job }) {
  const { data: data } = userApi.useGetUserQuery(props.designerId);
  return (
    <div className=" flex flex-col w-full">
      <div className=" flex flex-row items-center justify-between w-full">
        <div className=" flex flex-row">
          <Avatar
            className={` outline outline-3 outline-offset-2 ${
              data?.userType == "DESIGNER"
                ? "outline-designer"
                : "outline-producer"
            }`}
            alt={data ? `${data.firstName} ${data.lastName}` : ""}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 64, height: 64 }}
          />
          <div className=" px-4 flex flex-col justify-center">
            <p className=" text-lg">
              {data && data.firstName} {data && data.lastName}
            </p>
            <p className=" text-sm opacity-70">
              {data && capitalize(data.userType)}
            </p>
          </div>
        </div>
        {props.job && <JobAcceptButtons currentJob={props.job} />}
      </div>
    </div>
  );
}

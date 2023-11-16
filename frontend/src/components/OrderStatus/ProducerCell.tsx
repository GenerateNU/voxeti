import { Job } from "../../main.types";
import { userApi } from "../../api/api";
import { Avatar } from "@mui/material";

export default function ProducerCell(props: { job: Job }) {
  const { data: data } = userApi.useGetUserQuery(props.job.producerId as string);

  return (
    <div className="flex items-center text-lg">
      <Avatar
        style={{
          width: 80,
          height: 80,
          marginRight: 20,
          backgroundColor: "#87CEEB",
          color: "#87CEEB",
        }}
      >
        <Avatar
          style={{
            width: 70,
            height: 70,
            backgroundColor: "#FFFFFF",
            color: "#FFFFFF",
          }}
        >
          <Avatar src={""} style={{ width: 60, height: 60 }} />
        </Avatar>
      </Avatar>

      {data && data.firstName + " " + data.lastName}
    </div>
  );
}

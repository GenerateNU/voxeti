import { Job } from "../../main.types";
import { Avatar } from "@mui/material";

const statusColors = {
  ["PENDING"]: "#E8BB27",
  ["ACCEPTED"]: "#14AE5C",
  ["INPROGRESS"]: "#E8BB27",
  ["INSHIPPING"]: "#E8BB27",
  ["COMPLETE"]: "#14AE5C",
};

const statusText = {
  ["PENDING"]: "Pending",
  ["ACCEPTED"]: "Accepted",
  ["INPROGRESS"]: "In Progress",
  ["INSHIPPING"]: "In Shipping",
  ["COMPLETE"]: "Complete",
};

export default function StatusCell(props: { job: Job }) {
  return (
    <div className="flex items-center text-lg">
      <Avatar
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
          backgroundColor: statusColors[props.job.status],
          color: statusColors[props.job.status],
        }}
      />
      {statusText[props.job.status]}
    </div>
  );
}

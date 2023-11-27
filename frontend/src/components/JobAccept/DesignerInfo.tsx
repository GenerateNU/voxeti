import { userApi } from "../../api/api";
import { Address, Job } from "../../main.types";
import { Avatar } from "@mui/material";
import Divider from "@mui/material/Divider";
import * as React from "react";
import JobAcceptButtons from "./JobAcceptButtons";

export default function DesignerName(props: { job: Job }) {
  const { data: data } = userApi.useGetUserQuery(props.job.designerId);
  const [address, setAddress] = React.useState<Address>();

  React.useEffect(() => {
    if (data) {
      // Need to figure out which address to use for shipping
      const shipping = data.addresses[0];
      setAddress(shipping);
    }
  }, [data]);

  return (
    <div className=" flex flex-col w-full">
      <div className=" flex flex-row items-center justify-between w-full">
        <div className=" flex flex-row">
          <Avatar
            className=" outline outline-3 outline-offset-2 outline-designer"
            alt="Remy Sharp"
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
      <Divider variant="middle" className=" py-3" />
      <div className=" py-3" />
      <div className=" flex justify-between py-1 w-full">
        <p>Address</p>
        {address && (
          <div className=" text-right">
            <p>{address.line1}</p>
            <p>{address.line2}</p>
            <p>
              {address.city}, {address.state}
            </p>
            <p>
              {address.zipCode}, {address.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

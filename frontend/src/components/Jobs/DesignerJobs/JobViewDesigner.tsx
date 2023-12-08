import { useState } from "react";
import { jobApi, userApi } from "../../../api/api";
import { JobExtended } from "../JobRow";

import { Divider } from "@mui/material";
import AvatarCell from "../AvatarCell";
import Map from "../../Map/Map";
import { useApiError } from "../../../hooks/use-api-error";
import router from "../../../router";
import { JobStatus, NEW_USER_ID, User } from "../../../main.types";
import JobStatusTag from "../JobStatusTag";
import { GridItem } from "../JobInfoGridCell";

type JobViewDesignerProps = {
  jobId: string;
};

export default function JobViewDesigner({ jobId }: JobViewDesignerProps) {
  const [job, setJob] = useState<JobExtended>();
  const [producer, setProducer] = useState<User>();

  const [getJob, { isUninitialized }] = jobApi.useGetJobMutation();
  const [getUser] = userApi.useLazyGetUserQuery();

  const { addError, setOpen } = useApiError();

  // Retrieve page data:
  if (isUninitialized) {
    getJob(jobId)
      .unwrap()
      .then((jobResponse) => {
        setJob(jobResponse as JobExtended);
        // Retrieve the producer:
        if (jobResponse.producerId !== NEW_USER_ID) {
          getUser(jobResponse.producerId as string)
            .unwrap()
            .then((producerResponse) => {
              setProducer(producerResponse);
            })
            .catch(() => {
              addError("Failed to load producer information!");
              router.navigate({ to: "/jobs" });
              setOpen(true);
            });
        }
      })
      .catch(() => {
        addError("Failed to load job!");
        router.navigate({ to: "/jobs" });
        setOpen(true);
      });
  }

  // Job information:
  const address = (
    <>
      {job?.shippingAddress.line1},
      <br />
      {job?.shippingAddress.city}, {job?.shippingAddress.state}
    </>
  );

  const trackingNumber =
    job?.tracking === "" ? "No Information" : job?.tracking;
  const estimatedDelivery = () => {
    const date = new Date(job?.createdAt as Date);
    const shippingAdjustedDay = date.getDay() + 10;
    date.setDate(shippingAdjustedDay);
    return date.toDateString();
  };
  const price = `$${job?.price && (job.price / 100).toFixed(2)} USD`;
  const orderDate = new Date(job?.createdAt as Date).toDateString();

  return (
    <div className="flex flex-col w-full">
      <section className="flex items-center justify-between h-32 mt-10">
        {job?.status !== "PENDING" ? (
          <div>
            <h2 className="text-3xl">Your purchase with</h2>
            <h1 className="font-semibold text-3xl mt-2">
              {producer?.firstName + " " + producer?.lastName}
            </h1>
          </div>
        ) : (
          <h1 className="animate-pulse text-3xl">
            Searching for a producer...
          </h1>
        )}
        <AvatarCell
          firstName="Alder"
          lastName="Whiteford"
          userType="producer"
          imageOnly={true}
          size={120}
        />
      </section>
      <div className="flex flex-row gap-x-5 items-center">
        <h1 className="text-2xl">Status</h1>
        {job && <JobStatusTag status={job?.status as JobStatus} />}
      </div>
      <Divider className="!m-0 !mt-10" />
      <div className="flex flex-wrap justify-between items-center mt-10">
        <div className="grid grid-cols-2 grid-rows-2 gap-y-10 w-full md:w-[50%]">
          <GridItem title={"Delivery Location"}>{address}</GridItem>
          <GridItem title={"Tracking Number"}>{trackingNumber}</GridItem>
          <GridItem title={"Estimated Delivery"}>
            {estimatedDelivery()}
          </GridItem>
          <GridItem title={"Price"}>{price}</GridItem>
        </div>
        {job && (
          <div className="w-full md:w-[50%]">
            <Map
              latitude={job?.shippingAddress.location?.coordinates[1] as number}
              longitude={
                job?.shippingAddress.location?.coordinates[0] as number
              }
              zoom={15}
            />
          </div>
        )}
      </div>
      <Divider className="!m-0 !mt-10" />
      <div className="grid grid-cols-2 grid-rows-2 gap-y-10 md:w-[50%] mt-10">
        <GridItem title={"File Count"}>{job?.designId.length}</GridItem>
        <GridItem title={"Color"}>{job?.color}</GridItem>
        <GridItem title={"Filament Type"}>{job?.filament}</GridItem>
        <GridItem title={"Order Placed"}>{orderDate}</GridItem>
      </div>
      <Divider className="!m-0 !mt-10" />
    </div>
  );
}

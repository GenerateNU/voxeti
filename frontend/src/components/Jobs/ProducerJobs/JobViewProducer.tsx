import { useState } from "react";
import JobStatusTag from "../JobStatusTag";
import { JobExtended } from "../JobRow";
import { JobStatus, NEW_USER_ID, User } from "../../../main.types";
import { jobApi, userApi } from "../../../api/api";
import { useApiError } from "../../../hooks/use-api-error";
import router from "../../../router";
import { CircularProgress, Divider, TextField } from "@mui/material";
import StyledButton from "../../Button/Button";
import { useForm } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";
import AvatarCell from "../AvatarCell";
import { GridItem } from "../JobInfoGridCell";

type JobViewProducerProps = {
  jobId: string;
};

type TrackingForm = {
  tracking: string;
};

type ActionBarProps = {
  title: string;
  description: string;
  buttonText: string;
  status: "INPROGRESS" | "INSHIPPING" | "COMPLETE";
  onClick?: () => void;
};

export default function JobViewProducer({ jobId }: JobViewProducerProps) {
  const [job, setJob] = useState<JobExtended>();
  const [designer, setDesigner] = useState<User>();
  const [jobState, setJobState] = useState<JobStatus>();
  const [loading, setLoading] = useState<boolean>();
  const [trackingOpen, setTrackingOpen] = useState<boolean>();
  const [tracking, setTracking] = useState<boolean>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>({ mode: "onBlur" });

  const [getJob, { isUninitialized }] = jobApi.useGetJobMutation();
  const [patchJob] = jobApi.usePatchJobMutation();
  const [getUser] = userApi.useLazyGetUserQuery();

  const { addError, setOpen } = useApiError();

  const statusOrder = {
    PENDING: 0,
    ACCEPTED: 1,
    INPROGRESS: 2,
    INSHIPPING: 3,
    COMPLETE: 4,
  };

  // Retrieve page data:
  if (isUninitialized) {
    getJob(jobId)
      .unwrap()
      .then((jobResponse) => {
        setJob(jobResponse as JobExtended);
        setJobState(jobResponse.status);
        // Retrieve the producer:
        if (jobResponse.designerId !== NEW_USER_ID) {
          getUser(jobResponse.designerId as string)
            .unwrap()
            .then((designerResponse) => {
              setDesigner(designerResponse);
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

  const updateJobStatus = (newStatus: JobStatus) => {
    setLoading(true);
    patchJob({
      id: job?.id as string,
      body: {
        status: newStatus,
      },
    })
      .unwrap()
      .then(() => {
        setJobState(newStatus);
      })
      .catch(() => {
        addError("Failed to update job status!");
        setOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateTrackingNumber = (data: TrackingForm) => {
    setLoading(true);
    patchJob({
      id: job?.id as string,
      body: {
        tracking: data.tracking,
      },
    })
      .unwrap()
      .then(() => {
        setTrackingOpen(false);
        setTracking(true);
      })
      .catch(() => {
        addError("Failed to add tracking!");
        setOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const ActionBar = ({
    title,
    description,
    buttonText,
    status,
    onClick,
  }: ActionBarProps) => {
    const statusNum = statusOrder[status];
    const complete =
      statusNum < statusOrder[jobState as JobStatus] ||
      (status === "INSHIPPING" && (tracking || job?.tracking));
    const incomplete = statusNum > statusOrder[jobState as JobStatus];

    return (
      <section className="pt-10 pb-10 flex flex-col md:flex-row justify-between md:items-center gap-y-5">
        <h2 className="text-md">{title}</h2>
        <div className="md:w-[30%]">
          <h2>{description}</h2>
        </div>
        <StyledButton
          color={complete ? "success" : "primary"}
          size="md"
          onClick={onClick}
          disabled={incomplete || status === "COMPLETE"}
        >
          {loading && jobState === status ? (
            <CircularProgress />
          ) : complete ? (
            <>
              Completed
              <CheckIcon sx={{ marginLeft: "10px" }} />
            </>
          ) : (
            buttonText
          )}
        </StyledButton>
      </section>
    );
  };

  const JobConfirmModal = () => {
    return (
      <div className="absolute left-0 top-0 w-full h-full bg-primary bg-opacity-75 z-10 text-background text-2xl text-center rounded-xl">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <h1 className="mb-5">Are you ready to start the job?</h1>
          <StyledButton
            color="producer"
            size="md"
            onClick={() => updateJobStatus("INPROGRESS")}
          >
            {loading && jobState === "ACCEPTED" ? (
              <CircularProgress />
            ) : (
              "Start Printing"
            )}
          </StyledButton>
        </div>
      </div>
    );
  };

  const JobTrackingNumberModal = () => {
    return (
      <div className="absolute left-0 top-0 w-full h-full bg-background z-10 text-primary text-2xl text-center rounded-xl">
        <div className="flex flex-col w-full h-full justify-center items-center">
          <h1 className="mb-10">Please enter your tracking number</h1>
          <form onSubmit={handleSubmit(updateTrackingNumber)}>
            <TextField
              {...register("tracking", { required: "Please provide an email" })}
              error={!!errors?.tracking}
              helperText={
                (errors?.tracking?.message as string)
                  ? "Please provide a tracking number"
                  : " "
              }
              type="text"
              label="Tracking Number"
              variant="outlined"
              className="!w-[420px] !mb-10"
            />
            <div className="flex flex-row gap-x-5">
              <StyledButton
                color="primary"
                size="md"
                onClick={() => setTrackingOpen(false)}
              >
                Cancel
              </StyledButton>
              <StyledButton color="designer" size="md" type="submit">
                {loading ? <CircularProgress /> : "Submit"}
              </StyledButton>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const price = `$${job?.price && (job.price / 100).toFixed(2)} USD`;
  const orderDate = new Date(job?.createdAt as Date).toDateString();
  const shipBy = () => {
    const date = new Date(job?.createdAt as Date);
    const printingAdjustedDay = date.getDay() + 6;
    date.setDate(printingAdjustedDay);
    return date.toDateString();
  };
  const estimatedDelivery = () => {
    const date = new Date(job?.createdAt as Date);
    const shippingAdjustedDay = date.getDay() + 10;
    date.setDate(shippingAdjustedDay);
    return date.toDateString();
  };
  const address = (
    <>
      {job?.shippingAddress.line1},
      <br />
      {job?.shippingAddress.city}, {job?.shippingAddress.state}
    </>
  );

  return (
    <div>
      <div className="text-2xl mt-10 mb-10 flex flex-col md:flex-row gap-x-2">
        Order #{job?.id} for
        <h1 className="font-semibold">
          {designer?.firstName + " " + designer?.lastName}
        </h1>
      </div>
      <div className="flex flex-row gap-x-5 items-center">
        <h1 className="text-2xl">Status</h1>
        {job && <JobStatusTag status={jobState as JobStatus} />}
      </div>
      <Divider className="!m-0 !mt-10" />
      <div className="relative">
        {jobState === "ACCEPTED" ? (
          <JobConfirmModal />
        ) : trackingOpen ? (
          <JobTrackingNumberModal />
        ) : (
          <></>
        )}
        <ActionBar
          title="1. Print"
          description="Print the requested items."
          buttonText="Mark Complete"
          status={"INPROGRESS"}
          onClick={() => updateJobStatus("INSHIPPING")}
        />
        <Divider className="!m-0" />
        <ActionBar
          title="2. Ship"
          description="Package the items and drop them off at post office."
          status="INSHIPPING"
          buttonText="Add Tracking"
          onClick={() => setTrackingOpen(true)}
        />
        <Divider className="!m-0" />
        <ActionBar
          title="3. Deliver"
          buttonText="Complete"
          description="Your work is done! When this order has been delivered, the job will automatically be marked complete."
          status="COMPLETE"
        />
        <Divider className="!m-0" />
      </div>
      <section className="flex flex-col mt-10">
        <h2 className="text-2xl mb-10 mt-10">Order Information</h2>
        <div className="flex flex-row gap-x-5 items-center">
          <AvatarCell
            firstName="Alder"
            lastName="Whiteford"
            userType="designer"
            imageOnly={true}
            size={120}
          />
          <div>
            <h1 className="text-2xl font-semibold">
              {designer?.firstName + " " + designer?.lastName}
            </h1>
            <h2 className="text-xl font-semibold text-[#A4A4A4]">Designer</h2>
          </div>
        </div>
      </section>
      <Divider className="!m-0 !mt-10" />
      <div className="grid grid-cols-2 grid-rows-2 gap-y-10 md:w-[50%] mt-10">
        <GridItem title={"File Count"}>{job?.designId.length}</GridItem>
        <GridItem title={"Color"}>{job?.color}</GridItem>
        <GridItem title={"Filament Type"}>{job?.filament}</GridItem>
        <GridItem title={"Price"}>{price}</GridItem>
      </div>
      <Divider className="!m-0 !mt-10" />
      <div className="grid grid-cols-2 grid-rows-2 gap-y-10 md:w-[50%] mt-10">
        <GridItem title={"Order Placed"}>{orderDate}</GridItem>
        <GridItem title={"Ship By"}>{shipBy()}</GridItem>
        <GridItem title={"Estimated Delivery Date"}>
          {estimatedDelivery()}
        </GridItem>
        <GridItem title={"Address"}>{address}</GridItem>
      </div>
    </div>
  );
}

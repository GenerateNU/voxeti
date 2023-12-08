import { Divider } from "@mui/material";
import StyledButton from "../../../Button/Button";
import { JobStatus } from "../../../../main.types";
import { jobApi } from "../../../../api/api";
import { useApiError } from "../../../../hooks/use-api-error";
import React from "react";

export default function NextSteps(props: {
  jobId: string;
  jobStatus: JobStatus;
  designerName: string;
}) {
  const [patchJob] = jobApi.usePatchJobMutation();
  const { addError, setOpen } = useApiError();
  const [status, setStatus] = React.useState<JobStatus>(props.jobStatus);
  const [buttonStatus, setButtonStatus] = React.useState<
    ("PENDING" | "LOCKED" | "COMPLETED")[]
  >(["PENDING", "LOCKED", "LOCKED"]);

  React.useEffect(() => {
    switch (status) {
      case "PENDING":
        setButtonStatus(["PENDING", "LOCKED", "LOCKED"]);
        break;
      case "ACCEPTED":
        setButtonStatus(["PENDING", "LOCKED", "LOCKED"]);
        break;
      case "INPROGRESS":
        setButtonStatus(["COMPLETED", "PENDING", "LOCKED"]);
        break;
      case "INSHIPPING":
        setButtonStatus(["COMPLETED", "COMPLETED", "PENDING"]);
        break;
      case "COMPLETE":
        setButtonStatus(["COMPLETED", "COMPLETED", "COMPLETED"]);
        break;
    }
  }, []);

  const Step = (props: {
    step: string;
    description: string;
    status: "COMPLETED" | "PENDING" | "LOCKED";
    buttonLabel?: string;
    onClick: () => void;
  }) => {
    return (
      <div>
        <div className="grid grid-cols-3 gap-8 pt-4 items-center">
          <div>{props.step}</div>
          <div>{props.description}</div>
          <div className="flex flex-col justify-end">
            <StyledButton
              disabled={props.status === "LOCKED"}
              color={props.status === "COMPLETED" ? "success" : "primary"}
              onClick={
                props.status === "PENDING"
                  ? props.onClick
                  : () => console.log("Cant click")
              }
            >
              {props.status === "COMPLETED" ? "Completed ✓" : "Complete"}
            </StyledButton>
            {props.buttonLabel && (
              <div className="flex flex-row flex-wrap self-center pt-2">
                {props.buttonLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CustomDivider = () => {
    return <Divider variant="middle" className="!m-0 py-3" />;
  };

  const changeStatus = (
    newStatus: JobStatus,
    newButtons: ("PENDING" | "COMPLETED" | "LOCKED")[]
  ) => {
    patchJob({
      id: props.jobId,
      body: { status: newStatus },
    })
      .unwrap()
      .then((job) => {
        console.log(job);
        setStatus(job.status);
        setButtonStatus(newButtons);
      })
      .catch((error) => {
        addError(error.data.message);
        setOpen(true);
      });
  };

  return (
    <div>
      <h1 className="text-2xl mt-6 mb-6">Job for {props.designerName}</h1>
      <h2 className="text-lg">Status</h2>
      <CustomDivider />
      <Step
        step="1. Print"
        description="Print the requested items."
        status={buttonStatus[0]}
        onClick={() =>
          changeStatus("INPROGRESS", ["COMPLETED", "PENDING", "LOCKED"])
        }
      />
      <CustomDivider />
      <Step
        step="2. Ship"
        description="Package the items and drop them off at the post office."
        buttonLabel="Ship by 10/23/2023"
        status={buttonStatus[1]}
        onClick={() =>
          changeStatus("INSHIPPING", ["COMPLETED", "COMPLETED", "PENDING"])
        }
      />
      <CustomDivider />
      <Step
        step="3. Delivery"
        description="Your work is done! When this order has been delivered, the job can be marked as complete."
        buttonLabel="Delivery Est. 10/30/2023"
        status={buttonStatus[2]}
        onClick={() =>
          changeStatus("COMPLETE", ["COMPLETED", "COMPLETED", "COMPLETED"])
        }
      />
      <CustomDivider />
      <div className=" pb-20" />
    </div>
  );
}

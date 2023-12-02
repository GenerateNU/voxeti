import { useParams } from "@tanstack/react-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Container, IconButton } from "@mui/material";
import { Link } from "@mui/material";
import * as React from "react";
import { jobApi } from "../api/api";
import { Address, Job, PageStatus } from "../main.types";
import DesignInfo from "../components/Jobs/ProducerJobs/components/DesignInfo";
import DesignerName from "../components/Jobs/ProducerJobs/components/DesignerInfo";
import { useApiError } from "../hooks/use-api-error";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import FieldValueRow from "../components/Jobs/ProducerJobs/components/FieldValueRow";

export default function JobInfo() {
  const [jobDetails] = jobApi.useGetJobMutation();
  const { addError, setOpen } = useApiError();

  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading
  );
  const [currentJob, setCurrentJob] = React.useState<Job>();

  const [jobPrice, setJobPrice] = React.useState(0);
  const [orderPlaced, setOrderPlaced] = React.useState<Date>();
  const [shipBy, setShipBy] = React.useState<Date>();
  const [estDelivery, setEstDelivery] = React.useState<Date>();

  const params = useParams();

  const jobInfo = [
    [
      { field: "Filament", value: currentJob?.filament },
      { field: "Layer Height", value: `${currentJob?.layerHeight}mm` },
      { field: "Color", value: `${currentJob?.color}` },
    ],
    [
      { field: "Order Placed", value: orderPlaced?.toLocaleDateString() },
      { field: "Ship By", value: shipBy?.toLocaleDateString() },
      { field: "Est. Delivery", value: estDelivery?.toLocaleDateString() },
    ],
    [{ field: "Price", value: `$${(jobPrice / 100).toFixed(2)}` }],
  ];

  const BackButton = () => {
    return (
      <IconButton href="/job-accept" aria-label="delete" size="small">
        <ArrowBackIosIcon fontSize="inherit" />
        <Link
          href="/job-accept"
          underline="none"
          color="black"
          sx={{ cursor: "pointer" }}
          className="!hidden md:!flex"
        >
          My Jobs
        </Link>
      </IconButton>
    );
  };

  const AddressBox = (props: { address: Address }) => {
    return (
      <div className=" flex justify-between py-1 w-full">
        <p>Address</p>
        {props.address && (
          <div className=" text-right">
            <p>{props.address.line1}</p>
            <p>{props.address.line2}</p>
            <p>
              {props.address.city}, {props.address.state}
            </p>
            <p>
              {props.address.zipCode}, {props.address.country}
            </p>
          </div>
        )}
      </div>
    );
  };

  const PageError = () => {
    return (
      <Container className="h-[60vh] min-h-[500px]">
        <Box className="flex flex-col justify-center items-center align-middle h-full">
          <BackButton />
        </Box>
      </Container>
    );
  };

  const PageSuccess = () => {
    return (
      <div className="py-32 w-full flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
          <BackButton />
          <div className=" py-3" />
          <div className=" flex flex-row justify-between">
            {currentJob && <DesignerName job={currentJob} />}
          </div>
          {currentJob &&
            currentJob.designId.map(
              (designId: string, index: number) =>
                designId && (
                  <DesignInfo
                    designId={designId}
                    quantity={currentJob.quantity[index]}
                  />
                )
            )}
          {jobInfo.slice(0, -1).map((section) => (
            <FieldValueRow section={section} />
          ))}
          {currentJob?.shippingAddress && (
            <AddressBox address={currentJob?.shippingAddress} />
          )}
          {jobInfo.slice(-1).map((section) => (
            <FieldValueRow section={section} />
          ))}
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (params.jobId) {
      jobDetails(params.jobId)
        .unwrap()
        .then((jobData: Job) => {
          setCurrentJob(jobData as Job);

          setJobPrice(jobData.price);

          const date = new Date(jobData.createdAt);
          setOrderPlaced(new Date(date));

          date.setDate(date.getDate() + 3);
          setShipBy(new Date(date));

          date.setDate(date.getDate() + 10);
          setEstDelivery(new Date(date));

          setPageStatus(PageStatus.Success);
        })
        .catch((error) => {
          addError("Job doesn't exist or you don't have permission");
          setOpen(true);
          console.log(error);
          setPageStatus(PageStatus.Error);
        });
    }
  }, [addError, jobDetails, params.jobId, setOpen]);

  switch (pageStatus) {
    case PageStatus.Success:
      return <PageSuccess />;
    case PageStatus.Error:
      return <PageError />;
    case PageStatus.Loading:
      return <Loading />;
  }
}

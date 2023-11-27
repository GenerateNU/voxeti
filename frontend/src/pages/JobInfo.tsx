import { useParams } from "@tanstack/react-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import { Link } from "@mui/material";
import Divider from "@mui/material/Divider";
import * as React from "react";
import { jobApi } from "../api/api";
import { Job } from "../main.types";
import DesignInfo from "../components/JobAccept/DesignInfo";
import DesignerName from "../components/JobAccept/DesignerInfo";
import { Box, CircularProgress, Container } from "@mui/material";
import { useApiError } from "../hooks/use-api-error";

export default function JobInfo() {
  const [jobDetails] = jobApi.useGetJobMutation();
  const { addError, setOpen } = useApiError();

  const [pageStatus, setPageStatus] = React.useState("LOADING");
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

  React.useEffect(() => {
    if (params.jobId) {
      jobDetails(params.jobId)
        .unwrap()
        .then((jobData: Job) => {
          setCurrentJob(jobData as Job);

          setJobPrice(jobData.price);

          let date = new Date(jobData.createdAt);
          setOrderPlaced(new Date(date));

          date.setDate(date.getDate() + 3);
          setShipBy(new Date(date));

          date.setDate(date.getDate() + 10);
          setEstDelivery(new Date(date));

          setPageStatus("GOOD");
        })
        .catch((error) => {
          addError("Job doesn't exist or you don't have permission");
          setOpen(true);
          console.log(error);
          setPageStatus("BAD");
        });
    }
  }, []);

  if (pageStatus == "LOADING")
    return (
      <Container className="h-[60vh] min-h-[500px]">
        <Box className="flex flex-col justify-center items-center align-middle h-full">
          <CircularProgress />
          <h1 className="text-lg font-semibold animate-pulse mt-5">
            Loading...
          </h1>
        </Box>
      </Container>
    );
  if (pageStatus == "BAD")
    return (
      <Container className="h-[60vh] min-h-[500px]">
        <Box className="flex flex-col justify-center items-center align-middle h-full">
          <BackButton />
        </Box>
      </Container>
    );

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
        {jobInfo.map((section) => (
          <div className=" flex flex-col">
            <Divider variant="middle" className=" py-3" />
            <div className=" py-3" />
            {section.map((row) => (
              <div className=" flex justify-between py-1">
                <p>{row.field}</p>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

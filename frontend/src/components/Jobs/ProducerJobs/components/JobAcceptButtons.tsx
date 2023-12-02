import * as React from "react";
import { Job } from "../../../../main.types";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { jobApi } from "../../../../api/api";
import { useStateSelector } from "../../../../hooks/use-redux";
import { useApiError } from "../../../../hooks/use-api-error";

declare module "@mui/material/styles" {
  interface Palette {
    black: Palette["primary"];
  }

  interface PaletteOptions {
    black?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an black option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    black: true;
  }
}

const theme = createTheme({
  palette: {
    black: {
      main: "#000000",
      light: "#AAAAAA",
      dark: "#020202",
      contrastText: "#FFFFFF",
    },
  },
});

export default function JobAcceptButtons(props: { currentJob: Job }) {
  const [jobStatus, setJobStatus] = React.useState(props.currentJob.status);
  const [patchJob] = jobApi.usePatchJobMutation();

  const { addError, setOpen } = useApiError();
  const { user } = useStateSelector((state) => state.user);

  const acceptJob = () => {
    console.log("accepting job");

    const jobId = props.currentJob.id;
    if (jobId) {
      console.log("patching job");
      patchJob({ id: jobId, body: { producerId: user.id } })
        .unwrap()
        .then((jobData: Job) => {
          console.log("success");
          console.log(jobData);
          setJobStatus("ACCEPTED");
        })
        .catch((error) => {
          addError("Error accepting the job");
          setOpen(true);
          console.log(error);
        });
    }
  };

  const declineJob = () => {
    console.log(`declined job ${props.currentJob.id}`);

    //Send to confirmation page that job has been decline
  };

  if (jobStatus.toUpperCase() === "PENDING") {
    return (
      <ThemeProvider theme={theme}>
        <div className=" flex flex-row flex-wrap items-center justify-end gap-y-1 gap-x-2">
          <Button
            variant="contained"
            color="black"
            className=" w-32"
            onClick={acceptJob}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="black"
            className=" w-32"
            href="/job-accept"
            onClick={declineJob}
          >
            Decline
          </Button>
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div className=" flex flex-row flex-wrap items-center justify-end gap-y-1 gap-x-4">
          <p className=" text-producer">JOB ACCEPTED</p>
          <Button
            href="/job-accept"
            variant="outlined"
            color="black"
            className=""
          >
            Current Jobs
          </Button>
        </div>
      </ThemeProvider>
    );
  }
}

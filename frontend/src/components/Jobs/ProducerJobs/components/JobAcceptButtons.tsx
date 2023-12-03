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
  const [putDeclineJob] = jobApi.useDeclineJobMutation();
  const [putAcceptJob] = jobApi.useAcceptJobMutation();

  const { addError, setOpen } = useApiError();
  const { user } = useStateSelector((state) => state.user);

  const acceptJob = () => {
    const jobId = props.currentJob.id;

    if (jobId) {
      putAcceptJob({
        id: jobId,
        producerId: user.id,
      })
        .unwrap()
        .then(() => {
          setJobStatus("ACCEPTED");
          console.log("job successfully accepted");
        })
        .catch((error) => {
          addError("Error accepting the job");
          setOpen(true);
          console.log(error);
        });
    }
  };

  const declineJob = () => {
    const jobId = props.currentJob.id;

    if (jobId) {
      putDeclineJob({
        id: jobId,
        producerId: user.id,
      })
        .unwrap()
        .then(() => {
          console.log("job successfully declined");
        })
        .catch((error) => {
          addError("Error declining the job");
          setOpen(true);
          console.log(error);
        });
    }

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
            href="/jobs"
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
          <Button href="/jobs" variant="outlined" color="black" className="">
            Current Jobs
          </Button>
        </div>
      </ThemeProvider>
    );
  }
}

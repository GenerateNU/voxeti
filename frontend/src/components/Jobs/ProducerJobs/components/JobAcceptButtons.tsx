import * as React from "react";
import { Job } from "../../../../main.types";
import { createTheme, ThemeProvider } from "@mui/material";
import { jobApi } from "../../../../api/api";
import { useStateSelector } from "../../../../hooks/use-redux";
import { useApiError } from "../../../../hooks/use-api-error";
import StyledButton from "../../../Button/Button";

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
        <div className="flex flex-row items-center justify-end gap-y-1 gap-x-2">
          <StyledButton
            color="primary"
            onClick={acceptJob}
            size="md"
          >
            Accept
          </StyledButton>
          <StyledButton
            color="seconday"
            href="/jobs"
            onClick={declineJob}
            size="md"
          >
            Decline
          </StyledButton>
        </div>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div className=" flex flex-row items-center justify-end gap-y-1 gap-x-2">
          <StyledButton color="success" size="md">Job Accepted</StyledButton>
          <StyledButton href="/jobs" color="seconday" size="md">
            Current Jobs
          </StyledButton>
        </div>
      </ThemeProvider>
    );
  }
}

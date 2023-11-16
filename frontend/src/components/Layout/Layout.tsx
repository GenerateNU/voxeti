import React, { forwardRef } from "react";
import Navbar from "../Navbar/Navbar";
import { useApiError } from "../../hooks/use-api-error";
import { Slide, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';


export default function Layout({ children }: { children: React.ReactNode }) {
  const { error, open, setOpen, removeError } = useApiError();

  // Handle Error Closing:
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
    event?.isTrusted;
    return;
    }
    setOpen(false);
  };

  const handleRemoveError = () => {
    if (!open && removeError) {
      removeError()
    }
  }

  // Voxeti Alert:
  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div
      id="layout"
      className="min-h-screen flex flex-col bg-background text-body-text"
    >
      <Snackbar
        className='!mt-16'
        open={open}
        autoHideDuration={5000}
        transitionDuration={200}
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        onClose={handleClose}
        TransitionComponent={Slide}
        onAnimationEnd={handleRemoveError}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%' }}
          onAnimationEnd={handleRemoveError}
        >
          {error}
        </Alert>
      </Snackbar>
      {/* <Navbar /> */}
      {children}
    </div>
  );
}

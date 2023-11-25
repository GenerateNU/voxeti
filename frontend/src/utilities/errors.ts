import { BackendError } from "../hooks/hooks.types"
import { AppDispatch } from "../store/store";
import { resetUser } from "../store/userSlice";

type ErrorHandlerProps = {
  dispatch: AppDispatch,
  addError: (x: string) => void,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  error: BackendError,
  customMessage?: string
}

export const ErrorHandler = ({ dispatch, addError, setOpen, error, customMessage } : ErrorHandlerProps) => {
  // If the user is not authenticated, reset the user data:
  if (error.status == 401) {
    dispatch(resetUser())
  } else {
    addError(customMessage ?? error.data?.error?.message ?? "Something wen't wrong, please try again.");
    setOpen(true);
  }
}

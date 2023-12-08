import { authApi } from "../api/api";
import router from "../router";
import { resetUser } from "../store/userSlice";
import { ErrorHandler } from "../utilities/errors";
import { useApiError } from "./use-api-error";
import { useStateDispatch } from "./use-redux";

export default function useLogout() {
  const [logout] = authApi.useLogoutMutation();
  const dispatch = useStateDispatch();
  const { addError, setOpen } = useApiError();

  const handleLogout = () => {
    logout({})
      .unwrap()
      .then(() => {
        dispatch(resetUser());
        router.navigate({ to: "/login" });
      })
      .catch((error) => {
        ErrorHandler({ dispatch, addError, setOpen, error });
      });
  };

  return handleLogout;
}

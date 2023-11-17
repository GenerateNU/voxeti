import { authApi } from "../api/api";
import router from "../router";
import { resetUser } from "../store/userSlice";
import { useStateDispatch } from "./use-redux";

export default function useLogout() {
  const [logout] = authApi.useLogoutMutation();
  const dispatch = useStateDispatch()

  const handleLogout = () => {
    logout({})
      .unwrap()
      .then(() => {
        router.navigate({to: "/login"})
        dispatch(resetUser())
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return handleLogout
}

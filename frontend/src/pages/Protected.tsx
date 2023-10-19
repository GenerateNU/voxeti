import { Button } from "@mui/material"
import Auth from "../components/Auth/Auth";
import { useStateDispatch, useStateSelector } from "../hooks/use-redux"
import { authApi } from "../api/api";
import { resetUser } from "../store/userSlice";

export default function Protected() {
  const { csrfToken } = useStateSelector(state => state.user);
  const dispatch = useStateDispatch();
  const [logout] = authApi.useLogoutMutation();

  const handleLogout = () => {
    logout(csrfToken)
      .unwrap()
      .then(() => {
        dispatch(resetUser());
      })
  }

  return (
    <Auth authRoute={true}>
      <h1 className='mt-20'>This route is protected!</h1>
      <Button onClick={handleLogout}>
        Logout
      </Button>
    </Auth>
  );
}

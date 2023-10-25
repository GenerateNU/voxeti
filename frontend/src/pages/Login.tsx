import { useEffect, useState } from "react";
import SocialProviderPending from "../components/SocialProviderPopUp/SocialProviderPending";
import SocialProvider from "../components/SocialProvider/SocialProvider";
import useGoogle from "../hooks/use-google";
import { authApi } from "../api/api";
import { setSSONewUser, setUser } from "../store/userSlice";
import { useStateDispatch } from "../hooks/use-redux";
import Auth from "../components/Auth/Auth";
import { UserSliceState } from "../store/store.types";

export function Login() {
  const NEW_USER_ID = '000000000000000000000000'
  const [providerLoginPending, setProviderLoginPending] = useState(false);
  const [providerUser, setProviderUser] = useState<UserSliceState>();
  const [provider, setProvider] = useState('');

  const [googleSSO, { isLoading : isGoogleLoading }] = authApi.useGoogleSSOMutation();
  const dispatch = useStateDispatch()

  const googleLogin = useGoogle({ setProviderLoginPending, setProviderUser, googleSSO });

  useEffect(() => {
    if (providerUser) {
      if (providerUser.user.id === NEW_USER_ID) {
        dispatch(setSSONewUser({
          email: providerUser.user.email,
          socialProvider: providerUser.user.socialProvider
        }))
      } else {
        dispatch(setUser(providerUser));
      }
    }
  }, [dispatch, providerUser])

  return (
    <Auth authRoute={false}>
      {providerLoginPending &&
        <SocialProviderPending
          provider={provider}
          setState={setProviderLoginPending}
          onClick={googleLogin}
        />}
      <SocialProvider
        provider={'Google'}
        setState={setProviderLoginPending}
        setProvider={setProvider}
        onClick={googleLogin}
        isLoading={isGoogleLoading}
      />
    </Auth>
  )
}

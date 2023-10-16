import { useEffect, useState } from "react";
import SocialProviderPending from "../components/SocialProviderPopUp/SocialProviderPending";
import SocialProvider from "../components/SocialProvider/SocialProvider";
import useGoogle from "../hooks/use-google";
import { ProviderUser, UserCredentials } from "../api/api.types";
import { authApi } from "../api/api";
import { setSSONewUser } from "../store/userSlice";
import router from "../router";
import { useStateDispatch } from "../hooks/use-redux";

export function Login() {
  const [providerLoginPending, setProviderLoginPending] = useState(false);
  const [providerUser, setProviderUser] = useState<ProviderUser>();
  const [provider, setProvider] = useState('');

  const [login] = authApi.useLoginMutation();
  const [googleSSO, { isLoading : isGoogleLoading }] = authApi.useGoogleSSOMutation();
  const dispatch = useStateDispatch()

  const googleLogin = useGoogle({ setProviderLoginPending, setProviderUser, googleSSO });

  const handleLogin = (userCredentials : UserCredentials) => {
    login(userCredentials)
      .unwrap()
      .then((res) => {
        // WHAT TO DO AFTER US LOGIN SUCCESS:
        console.log(res);
      })
      .catch((err) => {
        // ERROR HANDLING NEEDS TO BE SETUP:
        console.log(err);
      })
  }

  useEffect(() => {
    if (providerUser?.userType === 'new') {
      dispatch(setSSONewUser({
        email: providerUser.user,
        socialProvider: providerUser.provider
      }))
      router.navigate({to: '/register'})
    }
    if (providerUser?.userType === 'existing') {
      handleLogin({
        email: providerUser.userType,
        password: ""
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerUser])

  return (
    <>
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
    </>
  )
}

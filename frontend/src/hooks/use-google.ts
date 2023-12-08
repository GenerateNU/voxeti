import { useGoogleLogin } from "@react-oauth/google";
import { GoogleSSOResponse, UseGoogleProps } from "./hooks.types";

export default function useGoogle({
  setProviderLoginPending,
  setProviderUser,
  googleSSO,
}: UseGoogleProps) {
  // Google login succeeds:
  function onSuccess(response: GoogleSSOResponse) {
    // Set provider pending to false:
    setProviderLoginPending(false);

    // Retrieve user information from Google:
    googleSSO(response.access_token as string)
      .unwrap()
      .then((res) => {
        setProviderUser({
          ...res,
          ssoAccessToken: response.access_token as string,
        });
      })
      .catch((err) => {
        // ERROR HANDLING NOT YET SETUP
        console.log(err);
      });
  }

  function onError() {
    setProviderLoginPending(false);
    console.log("ERROR");
  }

  const signIn = useGoogleLogin({
    onSuccess,
    onError,
    ux_mode: "popup",
  });

  return signIn;
}

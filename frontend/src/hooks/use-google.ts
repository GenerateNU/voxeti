import { useGoogleLogin } from "@react-oauth/google";
import { GoogleSSOResponse, UseGoogleProps } from "./hooks.types";
import { useApiError } from "./use-api-error";

export default function useGoogle({
  setProviderLoginPending,
  setProviderUser,
  googleSSO,
}: UseGoogleProps) {
  const { addError, setOpen } = useApiError();

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
      .catch(() => {
        addError("Something went wrong, please try again");
        setOpen(true);
      });
  }

  function onError() {
    setProviderLoginPending(false);
  }

  const signIn = useGoogleLogin({
    onSuccess,
    onError,
    ux_mode: "popup",
  });

  return signIn;
}

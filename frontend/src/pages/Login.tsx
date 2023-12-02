import { useEffect, useState } from "react";
import SocialProviderPending from "../components/SocialProviderPopUp/SocialProviderPending";
import SocialProvider from "../components/SocialProvider/SocialProvider";
import useGoogle from "../hooks/use-google";
import { authApi } from "../api/api";
import { setSSOAccessToken, setUser } from "../store/userSlice";
import { useStateDispatch } from "../hooks/use-redux";
import Auth from "../components/Auth/Auth";
import { UserSliceState } from "../store/store.types";
import { UserCredentials } from "../api/api.types";
import { useForm } from "react-hook-form";
import router from "../router";
import { Grid, TextField, Typography, Link, CircularProgress } from "@mui/material";
import StyledButton from "../components/Button/Button";
import SignInImage from "../assets/signIn/SignInImage.png";
import SignInWrapper from "../components/SignInWrapper/SignInWrapper";
import { ErrorHandler } from "../utilities/errors";
import { useApiError } from "../hooks/use-api-error";
import { validateEmail } from "../utilities/Primitives/strings";
import { NEW_USER_ID } from "../main.types";

export function Login() {
  // SSO Auth State:
  const [providerLoginPending, setProviderLoginPending] = useState(false);
  const [providerUser, setProviderUser] = useState<UserSliceState>();
  const [provider, setProvider] = useState("");

  // Error State:
  const [emailError, setEmailError] = useState(false);
  const { addError, setOpen } = useApiError();

  // Auth API:
  const [login, { isLoading: isLoginLoading }] = authApi.useLoginMutation();
  const [googleSSO, { isLoading: isGoogleLoading }] = authApi.useGoogleSSOMutation();

  // Hooks:
  const dispatch = useStateDispatch();
  const googleLogin = useGoogle({
    setProviderLoginPending,
    setProviderUser,
    googleSSO,
  });

  // Handle Provider Login:
  useEffect(() => {
    if (providerUser) {
      if (providerUser.user.id === NEW_USER_ID) {
        dispatch(setSSOAccessToken(providerUser.ssoAccessToken))
        router.navigate({ to: '/register', search: { user: providerUser.user.email, provider: providerUser.user.socialProvider } })
      } else {
        dispatch(setUser(providerUser));
      }
    }
  }, [dispatch, providerUser]);

  // Handle User / Pass Login:
  const handleLogin = (userCredentials: UserCredentials) => {
    login(userCredentials)
      .unwrap()
      .then((res) => {
        dispatch(setUser(res));
      })
      .catch((error) => {
        ErrorHandler({ dispatch, addError, setOpen, error })
      });
  };

  // Login Form:
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UserCredentials>();

  const onSubmit = (formData: UserCredentials) => {
    if (!emailError) {
      handleLogin(formData);
    }
  };

  const emailChange = () => {
    const email = getValues("email");
    const validatedEmail = validateEmail(email);
    if (!validatedEmail && email.length > 0) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  return (
    <Auth authRoute={false}>
      {providerLoginPending && (
        <SocialProviderPending
          provider={provider}
          setState={setProviderLoginPending}
          onClick={googleLogin}
        />
      )}
      <SignInWrapper img_src={SignInImage}>
        <div className="flex flex-col justify-center pb-10 w-[75%] xl:w-[60%]">
          <h1 className="text-4xl font-semibold mb-12">Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email", { required: "Please provide an email" })}
              error={!!errors?.email || emailError}
              helperText={
                (errors?.email?.message as string) ?? emailError
                  ? "Please provide a valid email"
                  : " "
              }
              className="!mb-5"
              label="Email"
              variant="outlined"
              onBlur={() => emailChange()}
              fullWidth
            />
            <TextField
              {...register("password", {
                required: "Please provide a password",
              })}
              error={!!errors.password}
              helperText={(errors?.password?.message as string) ?? " "}
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              sx={{ mb: 0 }}
            />
            <Grid
              container
              className="!mb-20 !mt-0 justify-between"
              sx={{ typography: "body2" }}
            >
              <Grid item>
                <Typography
                  display="inline"
                  sx={{
                    py: 1,
                    color: "black",
                    fontSize: "12px",
                  }}
                >
                  Don't have an account? &nbsp;
                </Typography>
                <Link
                  href="/register"
                  variant="body2"
                  sx={{
                    py: 1,
                    color: "black",
                    fontSize: "12px",
                    textUnderlineOffset: "3px",
                    textDecorationColor: "black",
                  }}
                >
                  {"Register here"}
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    py: 1,
                    color: "black",
                    fontSize: "12px",
                    textUnderlineOffset: "3px",
                    textDecorationColor: "black",
                  }}
                >
                  {"Forgot Password"}
                </Link>
              </Grid>
            </Grid>
            <StyledButton type="submit" color='primary'>
              {isLoginLoading ?
                <CircularProgress size={25} sx={{ color:'white' }} />
                : "Sign In"
              }
            </StyledButton>
          </form>
          <div className="relative w-full flex justify-center mt-7 mb-7">
            <span className="before:content-normal before:block before:w-[45%] before:h-[2px] before:bg-inactivity before:absolute before:left-0 before:top-[50%] after:content-normal after:block after:w-[45%] after:h-[2px] after:bg-inactivity after:absolute after:right-0 after:top-[50%]">
              {" "}
              or
              {" "}
            </span>
          </div>
          <SocialProvider
            provider={"Google"}
            setState={setProviderLoginPending}
            setProvider={setProvider}
            onClick={googleLogin}
            isLoading={isGoogleLoading}
          />
        </div>
      </SignInWrapper>
    </Auth>
  );
}

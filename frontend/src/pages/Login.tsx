import { useEffect, useState } from "react";
import SocialProviderPending from "../components/SocialProviderPopUp/SocialProviderPending";
import SocialProvider from "../components/SocialProvider/SocialProvider";
import useGoogle from "../hooks/use-google";
import { ProviderUser, UserCredentials } from "../api/api.types";
import { authApi } from "../api/api";
import { setSSONewUser, setUser } from "../store/userSlice";
import router from "../router";
import { useStateDispatch } from "../hooks/use-redux";
import Auth from "../components/Auth/Auth";
import SignInWrapper from "../components/SignInWrapper/SignInWrapper";
import PrinterImage from "../assets/peopleprinting.jpg"
import SignInOr from "../assets/SignInOr.png"
import StyledButton from "../components/Button/Button";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form"
import { validateEmail } from "../utilities/strings";


export function Login() {
  const [providerLoginPending, setProviderLoginPending] = useState(false);
  const [providerUser, setProviderUser] = useState<ProviderUser>();
  const [provider, setProvider] = useState('');
  const [emailError, setEmailError] = useState(false);
  // To replace with error handling:
  const [loginError, setLoginError] = useState(false);
  console.log(loginError);

  const [login] = authApi.useLoginMutation();
  const [googleSSO, { isLoading : isGoogleLoading }] = authApi.useGoogleSSOMutation();
  const dispatch = useStateDispatch()

  const googleLogin = useGoogle({ setProviderLoginPending, setProviderUser, googleSSO });

  const handleLogin = (userCredentials : UserCredentials) => {
    login(userCredentials)
      .unwrap()
      .then((res) => {
        dispatch(setUser(res));
        router.navigate({ to: '/protected'})
      })
      .catch((err) => {
        // ERROR HANDLING NEEDS TO BE SETUP:
        console.log(err);
        setLoginError(true);
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
        email: providerUser.user,
        password: ""
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerUser])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<UserCredentials>()

  const onSubmit = (formData : UserCredentials) => {
    if (!emailError) {
      handleLogin(formData)
    }
  }

  const emailChange = () => {
    const email = getValues("email");
    const validatedEmail = validateEmail(email);
    if (!validatedEmail && email.length > 0) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }

  console.log(emailError)

  return (
    <Auth authRoute={false}>
      {providerLoginPending &&
          <SocialProviderPending
            provider={provider}
            setState={setProviderLoginPending}
            onClick={googleLogin}
          />
      }
      <SignInWrapper img_src={PrinterImage}>
        <div className='flex flex-col h-full justify-center pb-10 w-[75%] xl:w-[60%]'>
          <h1 className='text-4xl font-light mb-12'>Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("email", { required: "Please provide an email" })}
              error={!!errors?.email || emailError}
              helperText={errors?.email?.message as string ?? emailError ? "Please provide a valid email" : " "}
              className="!mb-5"
              type="email"
              label="Email"
              variant="outlined"
              onBlur={() => emailChange()}
              fullWidth
            />
            <TextField
              {...register("password", { required: "Please provide a password" })}
              className="!mb-12"
              error={!!errors.password}
              helperText={errors?.password?.message as string ?? " "}
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
            />
            <StyledButton title={"Sign In"} color={"primary"} type='submit'>
              Sign In
            </StyledButton>
          </form>
          <img className="mt-10" src={SignInOr}/>
          <SocialProvider
            provider={'Google'}
            setState={setProviderLoginPending}
            setProvider={setProvider}
            onClick={googleLogin}
            isLoading={isGoogleLoading}
          />
        </div>
      </SignInWrapper>
    </Auth>
  )
}

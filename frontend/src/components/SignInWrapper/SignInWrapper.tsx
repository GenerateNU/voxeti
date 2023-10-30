import { Grid } from "@mui/material";
import { SignInWrapperProps } from "./SignInWrapper.types";

export default function SignInWrapper({
  img_src,
  children,
}: SignInWrapperProps) {
  return (
    <Grid container className="grow flex mt-16 min-h-[667px]">
      <Grid lg={6} className="flex grow justify-center items-center">
        {children}
      </Grid>
      <Grid item sm={6} className="hidden lg:flex justify-center items-center">
        <img src={img_src} className="max-w-[85%] max-h-[85%]" />
      </Grid>
    </Grid>
  );
}

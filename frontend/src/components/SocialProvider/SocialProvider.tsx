import { SocialProviderProps } from "./SocialProvider.types";
import Button from "@mui/material/Button";
import GoogleLogo from "../../assets/googleLogo.png";
import LoadingIcon from "../../assets/loadingIcon.gif";

export default function SocialProvider({
  provider,
  setProvider,
  setState,
  onClick,
  isLoading,
}: SocialProviderProps) {
  const handleClick = () => {
    // Set the selected provider:
    setProvider(provider);
    // Set the pending state to true:
    setState(true);
    // Intialize SSO:
    onClick();
  };

  return (
    <Button
      className="h-[50px] !bg-primary !normal-case !rounded-full !text-lg hover:!bg-[#5A5A5A] !font-light !mt-10"
      variant="contained"
      onClick={handleClick}
      startIcon={
        isLoading ? (
          <img className="h-[30px] mr-2" src={LoadingIcon} />
        ) : (
          <img className="h-[25px] mr-2" src={GoogleLogo} />
        )
      }
    >
      Continue with Google
    </Button>
  );
}

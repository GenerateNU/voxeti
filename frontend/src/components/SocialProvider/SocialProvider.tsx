import { SocialProviderProps } from "./SocialProvider.types";
import Button from "@mui/material/Button";
import GoogleLogo from "../../assets/googleLogo.png";
import { CircularProgress } from "@mui/material";

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
      className="h-[50px] !bg-background !normal-case !rounded-[5px] !text-lg hover:!bg-[#D3D3D3] !font-light !text-primary"
      variant="contained"
      onClick={handleClick}
      startIcon={
        isLoading ? (
          <CircularProgress size={25} sx={{ marginRight:'8px' }} />
        ) : (
          <img className="h-[25px] mr-2" src={GoogleLogo} />
        )
      }
    >
      Continue with Google
    </Button>
  );
}

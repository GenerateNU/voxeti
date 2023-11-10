import { Button } from "@mui/material";
import { StyledButtonProps } from "./Button.types";

export default function StyledButton({
  children,
  href,
  type,
  icon,
  disabled,
  onClick = () => {},
}: StyledButtonProps) {

  return (
    <Button
      className={'h-12 w-full !bg-primary !rounded-[5px] !text-background hover:!bg-[#565656] !normal-case !font-light !text-lg'}
      type={type}
      disabled={disabled}
      startIcon={icon}
      href={href}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

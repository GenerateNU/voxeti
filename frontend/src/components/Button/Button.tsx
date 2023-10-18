import { Button } from "@mui/material";
import { StyledButtonProps } from "./Button.types";

export default function StyledButton({title, children, href, type, icon, disabled, color, onClick = () => {}} : StyledButtonProps) {
  return (
    <Button
      className={`h-12 w-full !bg-${color} !rounded-full !text-background hover:!bg-[#565656] !normal-case !font-light !text-lg`}
      title={title}
      type={type}
      disabled={disabled}
      startIcon={icon}
      href={href}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
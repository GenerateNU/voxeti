import { Button } from "@mui/material";
import { StyledButtonProps } from "./Button.types";

export default function StyledButton({
  children,
  href,
  type,
  icon,
  disabled,
  size,
  color,
  onClick = () => {},
}: StyledButtonProps) {
  const sizes = {
    sm: "!w-[100px]",
    md: "!w-[200px]",
    lg: "!w-[400px]",
  };

  const colors = {
    // Background Color, Text Color, Background Hover Color
    primary: ["!bg-primary", "!text-background", "hover:!bg-[#565656]"],
    seconday: ["!bg-[#F5F5F5]", "!text-primary", "hover:!bg-[#D3D3D3]"],
    producer: ["!bg-producer", "!text-background", "hover:!bg-[#565656]"],
    designer: ["!bg-designer", "!text-background", "hover:!bg-[#565656]"],
    delete: ["!bg-[#F5F5F5]", "!text-error", "hover:!bg-[#FFCCCB]"],
    success: ["!bg-[#14AE5C]", "!text-background", "hover:!bg[#14AE5C]"],
  };

  return (
    <Button
      className={`h-12 ${size ? sizes[size] : "!w-full"} ${
        disabled ? "!bg-[#D3D3D3]" : color ? colors[color][0] : "!bg-primary"
      } !rounded-[5px] ${color ? colors[color][1] : "!text-background"}  ${
        colors[color][2]
      } !normal-case !text-base`}
      type={type}
      disabled={disabled}
      startIcon={icon}
      href={href}
      onClick={color === 'success' ? () => {} : onClick}
      sx={{
        cursor: `${color === 'success' ? 'default' : 'pointer'}`
      }}
    >
      {children}
    </Button>
  );
}

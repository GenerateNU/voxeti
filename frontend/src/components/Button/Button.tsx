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
    sm: '!w-[100px]',
    md: '!w-[200px]',
    lg: '!w-[400px]',
  }

  const colors = {
    primary: ['!bg-primary', '!text-background'],
    seconday: ['!bg-[#F5F5F5]', '!text-primary'],
    producer: ['!bg-producer', '!text-background'],
    designer: ['!bg-designer', '!text-background']
  }

  return (
    <Button
      className={`h-12 ${size ? sizes[size] : '!w-full'} ${disabled ? '!bg-[#D3D3D3]' : color ? colors[color][0] : '!bg-primary'} !rounded-[5px] ${color ? colors[color][1] : '!text-background'}  hover:!bg-[#565656] !normal-case !font-light !text-base`}
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

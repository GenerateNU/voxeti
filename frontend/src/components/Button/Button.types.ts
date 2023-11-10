import { ReactNode } from "react";

export interface StyledButtonProps {
  children: ReactNode;
  href?: string;
  type?: "submit";
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

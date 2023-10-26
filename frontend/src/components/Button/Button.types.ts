import { ReactNode } from "react";

export interface StyledButtonProps {
  title : string;
  children : ReactNode;
  href? : string;
  type? : 'submit'
  icon? : string;
  disabled? : boolean;
  color : 'primary' | 'producer' | 'designer';
  onClick? : () => void;
}

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { Button } from '@mui/material';
import { NavDropDownIconProps } from './NavDropDown.types';

export default function NavDropDownIcon({ setNavOpen, setHidden, hidden } : NavDropDownIconProps) {
  return (
    <Button 
      className='!flex !flex-row !items-center !bg-[#D9D9D9] !rounded-full !p-4 !gap-x-2 !text-[#000000]'
      onClick={() =>
        setNavOpen((state) => {
          if (!state && hidden) {
            setHidden(false);
          }
          return !state
        })
      }
    >
      <DehazeIcon />
      <AccountCircleIcon />
    </Button>
  )
}
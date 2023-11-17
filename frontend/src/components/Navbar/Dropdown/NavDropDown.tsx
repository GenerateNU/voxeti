import { Link } from "@mui/material";
import { NavDropDownProps } from "./NavDropDown.types";
import PersonIcon from '@mui/icons-material/Person';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function NavDropDown({ navOpen, hidden } : NavDropDownProps) {

  const navItems = [
    {
      href: '/profile',
      text: 'Account',
      icon: <PersonIcon />
    },
    {
      href: '/jobs',
      text: 'Jobs',
      icon: <ConstructionIcon />
    }
  ]

  return (
    <div
        className={`flex flex-col fixed w-full md:w-[275px] -top-[156px] shadow-md right-0 md:right-24 rounded-bl-lg rounded-br-lg ${navOpen ? 'animate-slideIn' : 'animate-slideOut'} ${hidden ? 'hidden' : 'visible'}`}
        style={{ animationFillMode: 'forwards' }}
      >
        {navItems.map((item) => {
          return (
            <Link
              href={item.href}
              className='flex flex-row gap-x-2 w-full h-14 items-center justify-center !text-primary !font-base bg-background hover:bg-[#000000] hover:bg-opacity-10 transition-all ease-in-out'
              underline='none'
            >
              {item.icon}
              {item.text}
            </Link>
          )
        })}
    </div>
  )
}

import { Link } from "@mui/material";
import { NavDropDownProps } from "./NavDropDown.types";
import PersonIcon from '@mui/icons-material/Person';
import ConstructionIcon from '@mui/icons-material/Construction';
import useLogout from "../../../hooks/use-logout";
import { useStateSelector } from "../../../hooks/use-redux";

export default function NavDropDown({ navOpen } : NavDropDownProps) {
  const logout = useLogout();
  const { user: currentUser } = useStateSelector((state) => state.user);

  const designerPages = [
    {
      href: '/profile',
      text: 'Profile',
      icon: <PersonIcon />
    },
    {
      href: '/jobs',
      text: 'Jobs',
      icon: <ConstructionIcon />
    },
    {
      href: '/purchase-history',
      text: 'Purchase History',
      icon: <ConstructionIcon />
    }
  ]

  const producerPages = [
    {
      href: '/profile',
      text: 'Profile',
      icon: <PersonIcon />
    },
    {
      href: '/jobs',
      text: 'Jobs',
      icon: <ConstructionIcon />
    }
  ]

  const user = [
    {
      onClick: () => logout(),
      text: 'Logout',
    },
  ]

  return (
    <div
        className={`flex flex-col fixed bg-background w-full md:w-[200px] top-24 z-10 shadow-md overflow-hidden right-0 md:right-24 !rounded-bl-2xl !rounded-br-2xl ${navOpen ? 'visible' : 'hidden'}`}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className='border-[#D9D9D9] border-t-[1px] border-b-[1px] pb-5'>
          {currentUser.userType==="DESIGNER" ? designerPages.map((item) => {
            return (
              <Link
                href={item.href}
                className='flex flex-row gap-x-2 w-full pt-5 pl-6 !text-base items-center !text-primary !font-base ease-in-out cursor-pointer !transition-all hover:!text-[#7A7A7A]'
                underline='none'
              >
                {item.text}
              </Link>
            )
          }) : producerPages.map((item) => {
            return (
              <Link
                href={item.href}
                className='flex flex-row gap-x-2 w-full pt-5 pl-6 !text-base items-center !text-primary !font-base ease-in-out cursor-pointer !transition-all hover:!text-[#7A7A7A]'
                underline='none'
              >
                {item.text}
              </Link>
            )
          })}
        </div>
        <div className='border-[#D9D9D9] pb-5'>
          {user.map((item) => {
            return (
              <Link
                onClick={item.onClick}
                className='flex flex-row gap-x-2 w-full pt-5 pl-6 !text-base items-center !font-base ease-in-out cursor-pointer !text-[#7A7A7A] hover:!text-primary transition-all'
                underline='none'
              >
                {item.text}
              </Link>
            )
          })}
        </div>
    </div>
  )
}

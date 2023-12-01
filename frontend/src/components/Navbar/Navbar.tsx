import { Fab, Link } from "@mui/material";
import { useState } from "react";
import NavDropDown from "./Dropdown/NavDropDown";
import NotifactionIcon from "../../assets/navbar/notifaction.png"
import ProfileIcon from "../../assets/navbar/profile.png"
import { useStateSelector } from "../../hooks/use-redux";

export default function NavBar() {
  const { user } = useStateSelector((state) => state.user)
  const loggedIn = user.id !== ""

  const [navOpen, setNavOpen] = useState(false);

  return (
    <div>
      <nav className='w-screen h-24 shadow-md p-6 md:pl-24 md:pr-24 flex flex-row items-center fixed z-10 bg-background'>
        <a
          className='text-2xl font-semibold mr-auto'
          href='/'
        >
          voxeti
        </a>
        {loggedIn &&
          <div className='flex flex-row items-center gap-x-6'>
            {user.userType === 'DESIGNER' && 
              <Link
                href="/upload-design"
                underline="none"
                color="black"
                className='!hidden md:!flex !cursor-pointer'
              >
                Create a Job
              </Link>
            }
            <Fab
              size='small'
              className='!shadow-none !bg-transparent'
            >
              <img className='h-6' src={NotifactionIcon}/>
            </Fab>
            <Fab
              size='small'
              className='!shadow-none !bg-transparent'
              onClick={() => setNavOpen(!navOpen)}
            >
              <img className='w-6' src={ProfileIcon}/>
            </Fab>
          </div>
        }
      </nav>
      {loggedIn &&
        <NavDropDown
          navOpen={navOpen}
        />
      }
    </div>
  );
}

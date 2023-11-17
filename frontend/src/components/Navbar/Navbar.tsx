import { Fab, Link } from "@mui/material";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NavDropDownIcon from "./Dropdown/NavDropDownIcon";
import { useState } from "react";
import NavDropDown from "./Dropdown/NavDropDown";

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div>
      <nav className='w-screen h-24 shadow-md p-6 md:pl-24 md:pr-24 flex flex-row items-center fixed z-10 bg-background'>
        <a
          className='text-2xl font-semibold mr-auto'
          href='/'
        >
          Voxeti
        </a>
        <div className='flex flex-row items-center gap-x-4'>
          <Link
            href="/upload-design"
            underline="none"
            color="black"
            sx={{cursor: 'pointer'}}
            className='!hidden md:!flex'
          >
            Create a Job
          </Link>
          <Fab
            className='!shadow-none !bg-transparent'
          >
            <NotificationsNoneIcon />
          </Fab>
          <NavDropDownIcon
            setNavOpen={setNavOpen}
            setHidden={setHidden}
            hidden={hidden}
          />
        </div>
      </nav>
      <NavDropDown
        navOpen={navOpen}
        hidden={hidden}
      />
    </div>
  );
}

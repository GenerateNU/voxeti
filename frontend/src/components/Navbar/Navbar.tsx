import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";

// Represents the information a NavItem requires
type NavItemDetails = {
  title: string;
  link: string;
};

// An item on the Navbar
function NavItem({ title, link }: NavItemDetails) {
  return (
    <li>
      <a
        href={link}
        className="block py-2 pl-3 pr-4 text-primary/50 hover:text-primary transition-colors ease-in-out md:bg-transparent"
        aria-current="page"
      >
        {title}
      </a>
    </li>
  );
}

// A button on the navbar
function NavButton({ title, link }: NavItemDetails) {
  return (
    <li>
      <a
        href={link}
        className="bg-primary !border-primary !border-2 pt-3 pb-3 pl-8 pr-8 rounded-md text-background font-semibold transition-all ease-in-out hover:bg-background hover:text-primary"
      >
        {title}
      </a>
    </li>
  );
}

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [animation, setAnimation] = useState(false);

  const handleNavDropDown = () => {
    setNavOpen(!navOpen);
    setAnimation(true);
  };

  return (
    <nav className="bg-background w-full sticky top-0 shadow-md pt-5 pb-5">
      <div
        className="w-full flex lg:w-full justify-between"
        id="navbar-default"
      >
        {/* Navbar: Left-Section */}
        <ul className="font-medium flex items-center h-10 p-0 space-x-8 mt-0 text-primary">
          <a className="ml-10 flex items-center" href="/">
            <img src="src/assets/logo.png" className="w-12 h-12" />
            <h1 className="!ml-3 text-2xl text-primary font-semibold">
              Voxeti
            </h1>
          </a>
        </ul>
        {/* Navbar: Right-Section */}
        <ul className="hidden font-medium lg:flex items-center h-10 flex-col p-4 md:p-0 mt-4 mr-10 md:flex-row md:space-x-8 md:mt-0">
          <NavItem title={"About"} link={"#"} />
          <NavItem title={"Services"} link={"#"} />
          <NavItem title={"Contact"} link={"#"} />
          <NavButton title={"Login"} link={"/login"} />
          <NavButton title={"Sign Up"} link={"/register"} />
        </ul>

        <div className="flex lg:hidden items-center">
          <a className="w-8 h-8 text-sm rounded-lg mr-4" href="/login">
            <PersonIcon className="!w-full !h-full" color={"disabled"} />
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="w-10 h-10 text-sm rounded-lg mr-10"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={handleNavDropDown}
          >
            <MenuIcon
              className={`!w-full !h-full ${
                animation && navOpen && "animate-rotateOpen"
              } ${animation && !navOpen && "animate-rotateClose"} ${
                navOpen && "-rotate-90"
              }`}
              color={"disabled"}
              onAnimationEnd={() => setAnimation(false)}
            />
          </button>
        </div>
      </div>
      <div
        className={`${
          navOpen ? "" : "hidden"
        } lg:hidden w-full absolute mt-5 bg-background shadow-md`}
        onAnimationEnd={() => setAnimation(false)}
      >
        <ul>
          <a href="#">
            <div className="flex justify-center hover:bg-primary/10 p-5 cursor-pointer">
              About
            </div>
          </a>
          <a href="#">
            <div className="flex justify-center hover:bg-primary/10 p-5 cursor-pointer">
              Services
            </div>
          </a>
          <a href="#">
            <div className="flex justify-center hover:bg-primary/10 p-5 cursor-pointer">
              Contact
            </div>
          </a>
        </ul>
      </div>
    </nav>
  );
}

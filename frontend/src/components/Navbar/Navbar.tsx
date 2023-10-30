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
        className="block py-2 pl-3 pr-4 text-background hover:text-secondary/75 md:bg-transparent md:p-0 focus:outline focus:outline-2 focus:outline-tertiary rounded-lg"
        aria-current="page"
      >
        {title}
      </a>
    </li>
  );
}

export default function Navbar() {
  return (
    <nav className="flex items-center bg-primary sticky top-0 w-full h-18">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Drop down menu for mobile */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden
                  hover:bg-secondary/10 focus:outline focus:outline-2 focus:outline-tertiary"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="background"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className="hidden w-full md:flex md:w-full md:justify-between"
          id="navbar-default"
        >
          {/* Navbar: Left-Section */}
          <ul className="font-medium flex items-center h-10 flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
            <a href="/">
              <img src="src/assets/logo.png" width="44" height="44" />
            </a>
            <NavItem title={"About"} link={"#"} />
            <NavItem title={"Services"} link={"#"} />
          </ul>
          {/* Navbar: Right-Section */}
          <ul className="font-medium flex items-center h-10 flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
            <NavItem title={"Help"} link={"#"} />
            <NavItem title={"Log in"} link={"#"} />
            <NavItem title={"Sign up"} link={"/register"} />
          </ul>
        </div>
      </div>
    </nav>
  );
}

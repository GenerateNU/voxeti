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
        className="block py-2 pl-3 pr-4 text-background hover:text-primary rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
        aria-current="page"
      >
        {title}
      </a>
    </li>
  );
}

export default function Navbar() {
  return (
    <nav className="bg-text border-gray-200 dark:bg-gray-900">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Drop down menu for mobile */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden 
                  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        <div className="hidden w-full md:flex md:w-full md:justify-between" id="navbar-default">
          {/* Navbar: Left-Section */}
          <ul className="font-medium flex items-center h-10 flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <NavItem title={"Voxeti"} link={"#"} />
            <NavItem title={"About"} link={"#"} />
            <NavItem title={"Services"} link={"#"} />
          </ul>
          {/* Navbar: Right-Section */}
          <ul className="font-medium flex items-center h-10 flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <NavItem title={"Help"} link={"#"} />
            <NavItem title={"Log in"} link={"#"} />
            <NavItem title={"Sign up"} link={"#"} />
          </ul>
        </div>
      </div>
    </nav>
  );
}

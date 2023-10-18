import MenuIcon from '@mui/icons-material/Menu';

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
        className="block py-2 pl-3 pr-4 text-primary/50 hover:text-primary transition-colors ease-in-out md:bg-transparent md:p-0"
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
        href={ link }
        className="bg-primary !border-primary !border-2 pt-3 pb-3 pl-8 pr-8 rounded-md text-background font-semibold transition-all ease-in-out hover:bg-background hover:text-primary"
      >
        {title}
      </a>
    </li>
  )
}

export default function Navbar() {
  return (
    <nav className="bg-background w-full fixed shadow-md p-5">
        <div
          className="w-full flex lg:w-full justify-between"
          id="navbar-default"
        >
          {/* Navbar: Left-Section */}
          <ul className="font-medium flex items-center h-10 p-0 space-x-8 mt-0 text-primary">
            <a className='ml-10' href="/">
              <img src="src/assets/logo.png" width="44" height="44" />
            </a>
            <h1 className='!m-5 text-2xl text-primary font-semibold'>Voxeti</h1>
          </ul>
          {/* Navbar: Right-Section */}
          <ul className="hidden font-medium lg:flex items-center h-10 flex-col p-4 md:p-0 mt-4 mr-10 md:flex-row md:space-x-8 md:mt-0">
            <NavItem title={"About"} link={"#"} />
            <NavItem title={"Services"} link={"#"} />
            <NavItem title={"Contact"} link={"#"} />
            <NavButton title={"Login"} link={"/login"} />
            <NavButton title={"Sign Up"} link={"/register"} />
          </ul>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center w-10 h-10 justify-center text-sm rounded-lg lg:hidden
                    hover:bg-secondary/10 focus:outline focus:outline-2 focus:outline-tertiary mr-10"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <MenuIcon
              className='!w-full !h-full'
              color={'disabled'}
            />
          </button>
        </div>
    </nav>
  );
}

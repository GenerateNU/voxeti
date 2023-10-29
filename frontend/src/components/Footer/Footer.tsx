export default function Footer() {
  return (
    <nav className="mt-auto bg-primary h-16 min-w-full flex items-center">
      <div className="max-w-screen items-center justify-between p-4">
        <div className="w-full" id="navbar-default">
          <ul className="font-medium flex items-center h-5 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-background hover:text-secondary/75 focus:outline focus:outline-2 focus:outline-tertiary rounded-lg"
                aria-current="page"
              >
                Placeholder 1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-background hover:text-secondary/75 focus:outline focus:outline-2 focus:outline-tertiary rounded-lg"
              >
                Placeholder 2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-background hover:text-secondary/75 focus:outline focus:outline-2 focus:outline-tertiary rounded-lg"
              >
                Placeholder 3
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

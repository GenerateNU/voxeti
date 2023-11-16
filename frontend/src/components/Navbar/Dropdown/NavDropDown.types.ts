export type NavDropDownIconProps = {
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setHidden: React.Dispatch<React.SetStateAction<boolean>>,
  hidden: boolean,
}

export type NavDropDownProps = {
  navOpen: boolean,
  hidden: boolean,
}
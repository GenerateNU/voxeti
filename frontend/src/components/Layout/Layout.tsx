import React from "react";
import Footer from "../Footer/Footer";
// import Navbar from "../Navbar/Navbar";
import NavBarV2 from "../Navbar/NavbarV2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="layout"
      className="min-h-screen flex flex-col bg-background text-body-text"
    >
      <NavBarV2 />
      {children}
      <Footer />
    </div>
  );
}

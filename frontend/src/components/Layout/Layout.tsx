import React from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="layout"
      className="min-h-screen flex flex-col bg-background text-body-text"
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

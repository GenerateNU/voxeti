import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="layout"
      className="flex min-h-screen flex-col bg-background text-body-text"
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="layout" className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

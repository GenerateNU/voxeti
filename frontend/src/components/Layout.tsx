import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="layout" className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {children}
      <h1 className="mt-auto bg-secondary">TODO: Footer</h1>
    </div>
  );
}

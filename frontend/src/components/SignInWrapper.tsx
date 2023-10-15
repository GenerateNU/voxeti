import React from "react";

export interface RouteProps {
  image: React.JSX.Element;
  children: React.ReactNode;
}

const SignInWrapper: React.FC<RouteProps> = ({ image, children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-background text-body-text">
      <div className="flex flex-col justify-center items-center p-8">
        {children}
      </div>
      <div className="hidden md:flex">{image}</div>
    </div>
  );
};

export default SignInWrapper;

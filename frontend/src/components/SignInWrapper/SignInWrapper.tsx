import React from "react";

export interface RouteProps {
  img_src: string;
  children: React.ReactNode;
}

const SignInWrapper: React.FC<RouteProps> = ({ img_src, children }) => {
  return (
    <div className="h-full grow grid grid-cols-1 lg:grid-cols-2 bg-background text-body-text">
      <div className="flex flex-col justify-center items-center pb-10 pt-10 h-full">
        {children}
      </div>
      <div className="hidden lg:flex h-full">
        <img className="w-full h-full object-cover" src={img_src} />
      </div>
    </div>
  );
};

export default SignInWrapper;

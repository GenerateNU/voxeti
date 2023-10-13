import React from "react";

// interface Props {
//   tab?: string;
//   image?: JSX.Element;
// }
// {props.image}

export default function SignInWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="layout" className="grid min-h-screen bg-background text-body-text">
      {children}
      <div>Image Goes Here</div>
    </div>
  );
}

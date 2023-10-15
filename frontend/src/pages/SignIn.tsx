import SignInWrapper, { RouteProps } from "../components/SignInWrapper";
import React from "react";

const SignIn: React.FC = () => {
  const image: RouteProps["image"] = (
    <img
      src="https://cdn.pixabay.com/photo/2023/09/20/20/17/skyline-8265564_1280.jpg"
      alt="descriptions"
    />
  ); // replace with your image element

  return (
    <SignInWrapper image={image}>
      {/* Add some content here */}
      <div>
        {/* Signin form here */}
        <div className="flex flex-col items-center justify-center border rounded-md">
          <h1 className="text-3xl font-bold mb-4">Sign In</h1>
          {/* Signin placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="flex flex-col gap-4">
              <label htmlFor="username" className="font-bold text-gray-700">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="border border-gray-400 rounded-lg py-2 px-3"
              />

              <label htmlFor="password" className="font-bold text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="border border-gray-400 rounded-lg py-2 px-3"
              />

              <button
                type="submit"
                className="text-white rounded-lg py-2 px-4 hover:bg-tertiary"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </SignInWrapper>
  );
};

export default SignIn;

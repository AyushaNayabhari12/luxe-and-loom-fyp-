import React from "react";
import Logo from "../shared/Logo";

export function AuthLayout({ children, title, subtitle, isSignUp }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div
        className={`sm:mx-auto sm:w-full ${
          !isSignUp ? "sm:max-w-md" : "sm:max-w-xl"
        }`}
      >
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
      </div>

      <div
        className={`mt-8 sm:mx-auto sm:w-full ${
          !isSignUp ? "sm:max-w-md" : "sm:max-w-xl"
        }`}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

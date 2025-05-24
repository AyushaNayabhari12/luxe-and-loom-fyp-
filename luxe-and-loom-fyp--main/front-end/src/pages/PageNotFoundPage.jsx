import { Button } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center bg-white px-4 text-center p-20">
      <div className="max-w-md">
        <h1 className="text-7xl font-bold text-rose-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Oops! The page you're looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6">
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

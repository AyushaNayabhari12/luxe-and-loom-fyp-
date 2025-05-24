import React, { useState } from "react";

import { AuthLayout } from "../../components/auth/AuthLayout";
import { Link, useNavigate } from "react-router";

import { Button } from "@material-tailwind/react";
import { postRequest } from "../../utils/apiHandler";
import { toast } from "sonner";
import { createCookie } from "../../utils/cookieHandler";
import { COOKIE_NAMES } from "../../config";
import useAuthContext from "../../hooks/useAuthContext";

export function SignIn() {
  const defaultAuthInfo = {
    email: "",
    password: "",
    otp: "",
  };

  const [authInfo, setAuthInfo] = useState(defaultAuthInfo);
  const { setCurrentUser, setAuthToken } = useAuthContext();
  const [requiresOtp, setRequiresOtp] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);

      const res = await postRequest({
        endpoint: "/auth/sign-in",
        data: authInfo,
      });

      if (res.ok) {
        const { token = "", user } = res.data;

        if (!user.isVerified) {
          setRequiresOtp(true);

          setError(res.message);
          return;
        }

        setAuthToken(token);
        setCurrentUser(user);

        toast.success("Login successful");
        createCookie(COOKIE_NAMES.TOKEN, token, 7);

        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }

        return;
      }

      setError(res.message || "An error occurred. Please try again.");
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Shwal Shops account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-800 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={authInfo.email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {requiresOtp && (
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <div className="mt-1">
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={authInfo.otp}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="Enter your OTP"
              />
            </div>
          </div>
        )}

        <div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={authInfo.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="text-sm text-right mt-1">
            <Link
              to="/forgot-password"
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button loading={loading} type="submit" className="w-full">
            Sign In
          </Button>
        </div>

        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-gray-900 hover:text-gray-700"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

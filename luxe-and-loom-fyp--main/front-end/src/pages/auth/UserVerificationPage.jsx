/* eslint-disable no-unused-vars */
import { Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";

import { Link, useSearchParams } from "react-router";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

import React from "react";
import { toast } from "sonner";

import { postRequest } from "../../utils/apiHandler";
import { SERVER_URL } from "../../config";

const UserVerificationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [displayLoader, setDisplayLoader] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const res = await fetch(`${SERVER_URL}/auth/verify-user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      setDisplayLoader(false);

      if (res.ok) {
        setIsVerified(true);
      }
    };
    verifyUser();
  }, []);

  if (displayLoader) {
    return <p className="p-20">Verifying User.....</p>;
  }

  if (!isVerified) {
    return <NotVerifiedComponent />;
  }

  return (
    <div className="bg-gray-300 h-[100vh] border flex items-center justify-center">
      <div className="bg-white text-center w-[90%] lg:w-[45%] h-[300px] lg:h-[350px] flex flex-col items-center justify-center gap-y-5 relative p-">
        <div className="text-7xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[230%] lg:-translate-y-[250%] h-[90px] w-[90px] bg-gray-300 rounded-full flex items-center justify-center absolute">
          <BsCheck2Circle className="text-green-600" />
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold">Thank you</h1>
        <p className="text-gray-600">
          You have verified your email successfully <br />
          <Link to="/authentication">
            <span className="text-blue-600 underline font-semibold cursor-pointer">
              Click here
            </span>{" "}
          </Link>{" "}
          to sign in
        </p>
      </div>
    </div>
  );
};

export default UserVerificationPage;

const NotVerifiedComponent = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setDisplayLoader(true);

    const res = await postRequest({
      endpoint: "/users/verification/",
      data: {
        email,
      },
    });
    setDisplayLoader(false);

    setIsModalOpen(false);
    setEmail("");

    if (res.ok) {
      toast.success(res.message);
      return;
    }

    toast.error(res.message);
  };

  const handleOpen = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {displayLoader && <Loader />}
      <div className="bg-gray-300 h-[100vh] border flex items-center justify-center">
        <div className="bg-white text-center w-[90%] lg:w-[45%] h-[320px] lg:h-[350px] flex flex-col items-center justify-center gap-y-4 relative px-4 md:px-0">
          <div className="text-7xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[240%] lg:-translate-y-[250%] h-[90px] w-[90px] bg-gray-300 rounded-full flex items-center justify-center absolute ">
            <RxCrossCircled className="text-red-600" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mt-7 md:mt-0">
            Unable to verify the email
          </h1>

          <p className="text-gray-600">
            The verification link that was sent to you has expired. <br />
            Please request a new verification link.
          </p>

          <Button
            type="button"
            className="w-[80%] lg:w-[40%]"
            onClick={handleOpen}
          >
            Resend Verification Link
          </Button>
        </div>

        <Dialog open={isModalOpen}>
          <DialogHeader>
            <h1 className="text-xl font-bold">Resend Verification Link</h1>
          </DialogHeader>

          <DialogBody>
            <form
              className="w-full m-auto flex items-center justify-center flex-col space-y-5"
              onSubmit={submitHandler}
              id="resend-verification-form"
            >
              <Input
                type="email"
                label="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </form>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              form="resend-verification-form"
              type="submit"
            >
              <span> Send Link</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
};

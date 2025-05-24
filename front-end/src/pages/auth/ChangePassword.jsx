import { Button, Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { postRequest } from "../../utils/apiHandler";

const ChangePasswordPage = () => {
  const defaultPasswordInfo = {
    newPassword: "",
    oldPassword: "",
    confirmNewPassword: "",
  };

  const [passwordInfo, setPasswordInfo] = useState(defaultPasswordInfo);

  const { newPassword, confirmNewPassword, oldPassword } = passwordInfo;

  const [displayLoader, setDisplayLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo({ ...passwordInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setDisplayLoader(true);

    const res = await postRequest({
      endpoint: `/auth/change-password/`,
      data: {
        oldPassword,
        newPassword,
      },
    });

    setDisplayLoader(false);

    if (!res.ok) {
      toast.error(res.message || "Something went wrong");
      return;
    }

    toast.success(res.message);

    setPasswordInfo(defaultPasswordInfo);
  };

  return (
    <div className="flex items-center justify-center p-20">
      <div className="bg-white p-6 rounded-lg px-2 md:px-5 py-5 md:pt-3 h-full w-[400px]">
        <h1 className="text-2xl font-bold text-center">Change Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="w-[100%] my-6 space-y-4">
            <Input
              size="md"
              label="Old Password"
              name="oldPassword"
              type="password"
              onChange={handleChange}
              value={passwordInfo.oldPassword}
              required
            />

            <Input
              size="md"
              label="New Password"
              name="newPassword"
              type="password"
              onChange={handleChange}
              value={passwordInfo.newPassword}
              required
            />

            <Input
              size="md"
              label="Confirm New Password"
              name="confirmNewPassword"
              onChange={handleChange}
              type="password"
              value={passwordInfo.confirmNewPassword}
              required
            />
          </div>

          <Button
            size="md"
            type="submit"
            loading={displayLoader}
            className="w-full"
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

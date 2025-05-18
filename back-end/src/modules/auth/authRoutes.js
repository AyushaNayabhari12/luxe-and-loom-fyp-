import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import {
  changePassword,
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
} from "./authController.js";

const authRouter = Router();

authRouter.route("/sign-up").post(signUp);
authRouter.route("/sign-in").post(signIn);
authRouter.route("/forgot-password").post(forgotPassword);

authRouter.use(authenticateToken);

authRouter.route("/reset-password").post(resetPassword);
authRouter.route("/change-password").post(changePassword);

export default authRouter;

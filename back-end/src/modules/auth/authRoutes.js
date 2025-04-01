import { Router } from 'express';
import { forgotPassword, resetPassword, signIn, signUp } from './authController.js';
import { authenticateToken } from '../../middlewares/auth.js';


const authRouter = Router();

authRouter.route('/sign-up').post(signUp);
authRouter.route('/sign-in').post(signIn);
authRouter.route('/forgot-password').post(forgotPassword);
authRouter.route('/reset-password').post(authenticateToken, resetPassword);
authRouter.route('/change-password').post(authenticateToken, resetPassword);


export default authRouter;



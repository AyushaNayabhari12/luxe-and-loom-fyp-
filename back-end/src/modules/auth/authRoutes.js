import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import {
    forgotPassword,
    resendUserVerificationEmail,
    resetPassword,
    signIn,
    signUp,
    verifyUser,
} from './authController.js';

const authRouter = Router();

authRouter.route('/sign-up').post(signUp);
authRouter.route('/sign-in').post(signIn);
authRouter.route('/forgot-password').post(forgotPassword);

authRouter.route('/send-verification-email').post(resendUserVerificationEmail);

authRouter.use(authenticateToken);

authRouter.route('/reset-password').post(resetPassword);
authRouter.route('/change-password').post(resetPassword);
authRouter.route('/verify-user').get(verifyUser);

export default authRouter;


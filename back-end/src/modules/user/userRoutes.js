import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.js';
import {
  getAllUsers,
  getSignedUser,
  getUserById,
  updateUserById,
} from './userController.js';
import upload from '../../middlewares/fileUpload.js';

const userRouter = Router();

userRouter.use(authenticateToken);

userRouter.route('/').get(getAllUsers);

userRouter.route('/me').get(getSignedUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .patch(upload.single('profileImageFile'), updateUserById);

export default userRouter;


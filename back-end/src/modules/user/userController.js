import {
  asyncErrorHandler,
  createError,
  deleteFile,
  sendSuccessResponse,
} from '../../utils/index.js';
import { User } from './user.js';
import { StatusCodes } from 'http-status-codes';
import { Order } from '../order/order.js';

// GET /users
export const getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find({
    role: 'user',
  });

  sendSuccessResponse({
    res,
    data: users,
    message: 'Users fetched successfully',
  });
});

// GET /users/:id
export const getUserById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found',
    });
  }

  user.password = null;

  sendSuccessResponse({
    res,
    data: user,
    message: 'User fetched successfully',
  });
});

// PUT /users/:id
export const updateUserById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, phoneNum, profileImage, deliveryAddress } = req.body;

  const newProfileImage = req?.file?.filename;

  if (!name || !address || !phoneNum || !profileImage || !deliveryAddress) {
    if (newProfileImage) {
      deleteFile(newProfileImage);
    }

    createError({
      message: 'All fields are required',
      statusCode: StatusCodes.BAD_REQUEST,
    });

    return;
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      address,
      phoneNum,
      profileImage: newProfileImage ? newProfileImage : profileImage,
      deliveryAddress,
    },
    {
      new: true,
    }
  );

  if (!user) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found',
    });
  }

  if (newProfileImage && !profileImage?.startsWith('https://')) {
    deleteFile(profileImage);
  }

  user.password = null;

  sendSuccessResponse({
    res,
    data: user,
    message: 'User Profile Updated successfully',
  });
});

// GET /users/me
export const getSignedUser = asyncErrorHandler(async (req, res) => {
  const id = req.userId;
  const user = await User.findById(id);

  if (!user) {
    createError({
      res,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found',
    });
  }

  user.password = null;

  sendSuccessResponse({
    res,
    data: user,
    message: 'User fetched successfully',
  });
});

// DELETE /users/:userId
export const deleteUser = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;

  await Promise.all([
    User.findByIdAndDelete(id),

    Order.deleteMany({
      user: id,
    }),
  ]);

  sendSuccessResponse({
    res,
    message: 'User Deleted Successful',
  });
});


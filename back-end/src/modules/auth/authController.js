import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { CLIENT_URL, FROM_EMAIL, SECRET_KEY } from '../../config/index.js';
import jwt from 'jsonwebtoken';

import {
  asyncErrorHandler,
  createError,
  sendMail,
  sendSuccessResponse,
} from '../../utils/index.js';
import { User } from '../user/user.js';

const sendUserVerificationEmail = async (userId, name, email) => {
  if (!userId || !name || !email) return;

  const token = jwt.sign({ userId }, SECRET_KEY, {
    expiresIn: '24h',
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${name},</p>
    <p>Thank you for registering with <strong>Luxe and Loom</strong>. To complete your registration and verify your email address, please click the button below:</p>
    <p>
      <a href="${CLIENT_URL}/verify-email?token=${token}" 
         style="display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
    </p>
    <p><strong>Note:</strong> This link will expire in 24 hours.</p>
    <p>If you didn’t register for an account, you can safely ignore this email.</p>
    <p>Thank you,<br/>The <strong>Luxe and Loom</strong> Team</p>
  </div>
`;

  await sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: 'Email Verification Request',
    html: htmlBody,
  });
};

// POST /auth/sign-up
export const signUp = asyncErrorHandler(async (req, res) => {
  const { name, email, address, phoneNum, password } = req.body;

  if (!name || !email || !address || !phoneNum || !password) {
    createError({
      message: 'All fields are required',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const isUserExist = await User.findOne({
    email,
  });

  if (isUserExist) {
    createError({
      message: 'User already exists with this email',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const user = new User({
    name,
    email,
    address,
    phoneNum,
    password,
  });

  const _user = await user.save();

  sendUserVerificationEmail(_user?.id, name, email);

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
  });
});

// POST /auth/sign-in
export const signIn = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    createError({
      message: 'Invalid data received',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const user = await User.findOne({ email });

  const isPasswordCorrect = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!isPasswordCorrect) {
    createError({
      message: 'Username or password incorrect',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  if (!user?.isVerified) {
    createError({
      message: 'User not verified. Please check your email for verification',
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const tokenExpiryTime = 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: tokenExpiryTime,
  });

  sendSuccessResponse({
    res,
    data: { token, user },
    message: 'Successfully logged in',
  });
});

// POST /auth/forgot-password
export const forgotPassword = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    createError({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Email is required',
    });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    createError({
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User does not exist with this email',
    });
    return;
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: 15 * 60, // 15 minutes
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user.name},</p>
    <p>We received a request to reset your password for your <strong>Luxe and Loom</strong> account. Click the button below to set a new password:</p>
    <p>
      <a href="${CLIENT_URL}/reset-password?token=${token}" 
         style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p><strong>Note:</strong> This link will expire in 15 minutes.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Thank you,<br/>The <strong>Luxe and Loom</strong> Team</p>
  </div>
`;

  await sendMail({
    from: FROM_EMAIL,
    to: user.email,
    subject: 'Reset Password Request',
    html: htmlBody,
  });

  sendSuccessResponse({
    res,
    message: 'Please check your email for the password reset link.',
  });
});

// POST /auth/reset-password
export const resetPassword = asyncErrorHandler(async (req, res) => {
  const { password } = req.body;
  const userId = req.userId;

  if (!password) {
    createError({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Password is required',
    });
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    createError({
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'User not found',
    });
    return;
  }

  user.password = password;

  await user.save();

  sendSuccessResponse({
    res,
    statusCode: StatusCodes.OK,
    message: 'Your password has been changed successfully.',
  });
});

// PATCH /auth/verify-user
export const verifyUser = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findByIdAndUpdate(userId, {
    isVerified: true,
  });

  if (!user) {
    createError({
      statusCode: 400,
      message: 'Unable to verify user. Please try again later!',
    });
    return;
  }

  sendSuccessResponse({
    res,
    message: 'User verified successfully.',
  });
});

// POST /auth/send-verification-email
export const resendUserVerificationEmail = asyncErrorHandler(
  async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      createError({
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found',
      });

      return;
    }

    if (user.isVerified) {
      createError({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'User already verified.',
      });

      return;
    }

    await sendUserVerificationEmail(user._id, user.name, user.email);

    sendSuccessResponse({
      res,
      message:
        'User verification mail sent successfully. Please check you email.',
    });
  }
);


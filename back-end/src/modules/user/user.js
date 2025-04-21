import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ROLE_ENUM } from '../../config/index.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters'],
    },
    phoneNum: {
      type: String,
      required: [true, 'Phone Number is required'],
      match: [/^\d{10,15}$/, 'Phone number must be between 7 to 15 digits'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profileImage: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ROLE_ENUM,
        message: `{VALUE} is not supported for the role`,
      },
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const password = this.password;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

  if (!regex.test(password)) {
    return next(
      new Error(
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character'
      )
    );
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model('User', userSchema);


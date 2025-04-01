import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ROLE_ENUM } from '../../config/index.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phoneNum: {
      type: String,
      required: [true, 'Phone Number is required'],
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
    role: {
      type: String,
      enum: ROLE_ENUM,
      enum: {
        values: ROLE_ENUM,
        message: `{VALUE} is not supported for the role`,
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

export const User = mongoose.model('User', userSchema);


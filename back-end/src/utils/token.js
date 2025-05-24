import jwt from "jsonwebtoken";
import { SECRET_KEY, TOKEN_EXPIRE_IN } from "../config/index.js";
import bcrypt from "bcrypt";

export const generateAuthToken = (
  tokenPayload,
  tokenExpiryDuration = TOKEN_EXPIRE_IN,
) => {
  const authToken = jwt.sign(tokenPayload, SECRET_KEY, {
    expiresIn: tokenExpiryDuration,
  });
  return authToken;
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

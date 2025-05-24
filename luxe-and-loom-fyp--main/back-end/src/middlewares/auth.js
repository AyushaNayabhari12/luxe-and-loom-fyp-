import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/index.js";
import { HttpStatus } from "../constant/index.js";
import { createError, asyncErrorHandler } from "../utils/index.js";

export const authenticateToken = asyncErrorHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    createError({
      message: "Authorization at headers is required",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  const authorizationParts = authorization.split(" ");

  const token = authorizationParts[1];

  if (!token || token === "undefined" || token === "null") {
    createError({
      message: "Access token is required to access this route",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  // check if token starts with Bearear and check if token exist
  if (authorizationParts[0] !== "Bearer" && token) {
    createError({
      message: "Invalid authorization headers received",
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  const userInfo = jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      createError({
        message: "Invalid auth token",
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return payload;
  });

  const { userId, role } = userInfo;

  req.userId = userId;
  req.role = role;
  req.authToken = token;

  next();
});

export const createError = ({ message, statusCode }) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

  // to differentiate between system error and custom error
  error.isOperationalError = true;

  console.log(error);

  throw error;
};

// this middleware handles the error globally
const handleError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.name === 'TokenExpiredError') {
    error.message = 'Unauthorized: Token is expired';
    error.statusCode = 401;
  }

  res.status(error.statusCode).json({
    status: error.statusCode || 500,
    message: error.message,
  });

  next();
};

export default handleError;


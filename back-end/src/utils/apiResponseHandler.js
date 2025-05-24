import { StatusCodes } from "http-status-codes";

export const sendSuccessResponse = ({
  res,
  data = null,
  statusCode = StatusCodes.OK,
  message = "",
}) => {
  return res.status(statusCode).json({
    status: "ok",
    ...(data && { data }),
    ...(message && { message }),
  });
};

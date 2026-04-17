import { StatusCodes } from "http-status-codes";
import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;

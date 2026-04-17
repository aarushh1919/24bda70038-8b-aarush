import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const message = `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`;

    switch (true) {
      case res.statusCode >= 500:
        logger.error(message);
        break;
      case res.statusCode >= 400:
        logger.warn(message);
        break;
      default:
        logger.info(message);
        break;
    }
  });

  next();
};

export default loggerMiddleware;

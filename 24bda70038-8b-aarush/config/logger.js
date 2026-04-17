import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(colorize({ all: true })),
  })
];

// Vercel filesystem is read-only. File logs are only active locally.
if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  transports.push(new winston.transports.File({ filename: "logs/combined.log" }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports,
});

export default logger;

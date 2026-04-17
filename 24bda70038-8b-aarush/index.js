import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import loggerMiddleware from './middleware/logger.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';
import rateLimitMiddleware from './middleware/ratelimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import logger from './config/logger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running successfully with Winston logging!" });
});

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

connectDB();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export default app;

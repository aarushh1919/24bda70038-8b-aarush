import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Connection Successful");
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;

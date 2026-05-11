import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

console.log("URI:", process.env.MONGODB_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ db.js: SUCCESS - MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ db.js: FAILED - Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
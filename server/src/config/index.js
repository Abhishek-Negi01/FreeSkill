import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "../utils/dotenv.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log(
      "\n MongoDB connected ! DB host : ",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.log("MongoDB connection error", error.message);
    process.exit(1);
  }
};

export default connectDB;

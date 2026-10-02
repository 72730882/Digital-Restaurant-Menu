import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    throw error;
  }
};

export default connectDB;

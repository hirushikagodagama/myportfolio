import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    const target = uri.replace(/\/\/([^@]+)@/, "//***:***@");
    throw new Error(`MongoDB connection failed for ${target}: ${error.message}`);
  }
};

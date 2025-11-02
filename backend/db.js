import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.warn("⚠️ No MONGO_URI found in environment variables, using default local connection");
}

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proctorDB";

const connectWithRetry = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoURI);
      console.log("✅ MongoDB Connected Successfully!");
      return true;
    } catch (err) {
      if (i === retries - 1) {
        console.error("❌ Final attempt to connect to MongoDB failed:", err);
        throw err;
      }
      console.warn(`⚠️ Failed to connect to MongoDB (attempt ${i + 1}/${retries}). Retrying in ${interval/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

const connectDB = async () => {
  try {
    await connectWithRetry();

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      // Attempt to reconnect on error
      setTimeout(() => connectWithRetry(), 5000);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
      setTimeout(() => connectWithRetry(), 5000);
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection restored");
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      try {
        await mongoose.connection.close();
        console.log(`MongoDB connection closed through ${signal}`);
        process.exit(0);
      } catch (err) {
        console.error(`Error during MongoDB connection closure (${signal}):`, err);
        process.exit(1);
      }
    };

    // Handle various termination signals
    process.on("SIGINT", () => gracefulShutdown("app termination"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGUSR2", () => gracefulShutdown("nodemon restart"));

  } catch (err) {
    console.error("❌ Error in MongoDB connection setup:", err);
    process.exit(1);
  }
};

export default connectDB;

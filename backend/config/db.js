const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.DB_DISABLED === "true") {
    console.warn("MongoDB Atlas connection disabled or MONGO_URI omitted. Running in database-disabled mode.");
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error("MongoDB connection offline/error:", error.message);
    console.warn("Running in database-disabled fallback mode. Database endpoints will return HTTP 503.");
    isConnected = false;
    return false;
  }
};

const isDbConnected = () => isConnected || mongoose.connection.readyState === 1;

module.exports = { connectDB, isDbConnected };

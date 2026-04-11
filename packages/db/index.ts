import mongoose from "mongoose";

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/swiftpe-db";

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("⚡ Using existing DB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(DATABASE_URL);

    isConnected = conn.connections[0]?.readyState === 1;

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}

export { connectDB };

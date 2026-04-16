import mongoose from "mongoose";

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/swiftpe-db";
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

let isConnected = false;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectDB() {
  if (isConnected) {
    console.log("⚡ Using existing DB connection");
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const conn = await mongoose.connect(DATABASE_URL);

      isConnected = conn.connections[0]?.readyState === 1;

      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      console.error(
        `❌ DB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
        err
      );

      if (attempt === MAX_RETRIES) {
        throw err;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
}

export { connectDB, mongoose };

import express from "express";
import { router } from "../routes/index";
import cors from "cors";
import { connectDB } from "@repo/db/connect";

async function startServer() {
  await connectDB();

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin:
        process.env.ENV === "production"
          ? "https://yourdomain.com"
          : "http://localhost:3000",
      optionsSuccessStatus: 200,
    })
  );
  app.use("/api/v1", router);

  app.listen(4000, () => {
    console.log("Backend is running on port 4000");
  });
}

startServer().catch((err) => {
  console.error("❌ Backend failed to start:", err);
  process.exit(1);
});

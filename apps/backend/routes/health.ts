import express, { type Request, type Response } from "express";

export const healthCheckRouter = express.Router();

healthCheckRouter.get("/", (req: Request, res: Response) => {
  res.send("SwiftPe Backend is up! ✅");
});

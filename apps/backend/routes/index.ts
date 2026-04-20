import express from "express";
import { userRouter } from "./user";
import { accountRouter } from "./account";
import { healthCheckRouter } from "./health";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/health", healthCheckRouter);

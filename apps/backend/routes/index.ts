import express from "express";
import { userRouter } from "./user";
import { accountRouter } from "./account";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

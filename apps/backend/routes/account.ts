import express, { type Request, type Response } from "express";
import { authMiddleware } from "../src/middleware";
import { AccountModel } from "@repo/db/models";
import { mongoose } from "@repo/db/connect";

export const accountRouter = express.Router();

accountRouter.get(
  "/balance",
  authMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
      const account = await AccountModel.findOne({ userId });

      res.json({
        balance: account?.balance,
      });
    } catch (error) {
      console.log("Error in account/balance endpoint: ", error);
      res
        .status(500)
        .json({ error: "Internal server error, Please try again later!" });
    }
  }
);

accountRouter.post(
  "/transfer",
  authMiddleware,
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const { amount, to } = req.body;

      const account = await AccountModel.findOne({
        userId: req.userId,
      }).session(session);

      if (!account || account.balance < amount) {
        session.abortTransaction();
        return res.status(400).json({
          error: "Insufficient balance!",
        });
      }

      const toAccount = await AccountModel.findOne({ userId: to }).session(
        session
      );

      if (!toAccount) {
        return res.status(400).json({
          error: "Invalid account",
        });
      }

      await AccountModel.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
      ).session(session);

      await AccountModel.updateOne(
        { userId: to },
        { $inc: { balance: amount } }
      ).session(session);

      await session.commitTransaction();

      res.json({
        msg: "Transaction Successful",
      });
    } catch (error) {
      session.abortTransaction();
      console.log("Error in account/transfer endpoint: ", error);
      res
        .status(500)
        .json({ error: "Internal server error, Please try again later!" });
    }
  }
);

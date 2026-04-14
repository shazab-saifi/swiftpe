import express, { type Request, type Response } from "express";
import { authMiddleware } from "./middleware";
import { AccountModel } from "@repo/db/models";

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

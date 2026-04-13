import express, { type Request, type Response } from "express";
import { signinSchema, signupSchema } from "../validation/user_schema";
import { UserModel } from "@repo/db/models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    const { username, password, lastName, firstName } = result.data;

    const existingUser = await UserModel.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(403).json({ error: "User Already Exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await UserModel.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

    res.json({ msg: "Signup Successful!", token });
  } catch (error) {
    console.log("Error in signup endpoint: ", error);
    res
      .status(500)
      .json({ error: "Internal server error, Please try again later!" });
  }
});

userRouter.post("/signin", (req: Request, res: Response) => {
  const result = signinSchema.safeParse(req.body);
});

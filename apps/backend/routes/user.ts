import express, { type Request, type Response } from "express";
import {
  signinSchema,
  signupSchema,
  updateInfoSchema,
} from "../validation/user_schema";
import { AccountModel, UserModel } from "@repo/db/models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authMiddleware } from "../src/middleware";

export const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    const { username, password, lastName, firstName } = result.data;

    const existingUser = await UserModel.findOne({
      username,
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

    await AccountModel.create({
      userId: user.id,
      balance: Math.floor(Math.random() * 20000 - 5000 + 1) + 5000,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.json({ msg: "Signup Successful!", token });
  } catch (error) {
    console.log("Error in signup endpoint: ", error);
    res
      .status(500)
      .json({ error: "Internal server error, Please try again later!" });
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  const result = signinSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({
      username,
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ error: "User with this username doesn't exists!" });
    }

    const comparePassword = bcrypt.compareSync(password, existingUser.password);

    if (!comparePassword) {
      return res.json(401).json({ error: "Incorrect Credentials!" });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET!
    );

    res.json({ token });
  } catch (error) {
    console.log("Error in signin endpoint: ", error);
    res
      .status(500)
      .json({ error: "Internal server error, Please try again later!" });
  }
});

userRouter.put("/", authMiddleware, async (req: Request, res: Response) => {
  const result = updateInfoSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    await UserModel.updateOne(
      {
        _id: req.userId,
      },
      req.body
    );

    res.json({ msg: "Updated Successfully!" });
  } catch (error) {
    console.log("Error in / put endpoint: ", error);
    res
      .status(500)
      .json({ error: "Internal server error, Please try again later!" });
  }
});

userRouter.get("/bulk", async (req: Request, res: Response) => {
  const filter = req.query.filter || "";

  try {
    const users = await UserModel.find({
      $or: [
        {
          firstName: {
            $regex: filter as string,
          },
        },
        {
          lastName: {
            $regex: filter as string,
          },
        },
      ],
    });

    res.json({
      user: users.map((user) => ({
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    });
  } catch (error) {
    console.log("Error in user/bulk endpoint: ", error);
    res
      .status(500)
      .json({ error: "Internal server error, Please try again later!" });
  }
});

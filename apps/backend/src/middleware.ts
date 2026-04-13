import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authToken.split(" ")[1];

  try {
    const validateToken = jwt.verify(token!, process.env.JWT_SECRET!);
    req.userId = (validateToken as JwtPayload).userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Auth validation failed!" });
  }
}

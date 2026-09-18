import type { AuthRequest } from "#shared/types.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log(decoded);

    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
}

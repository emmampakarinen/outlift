import jwt from "jsonwebtoken";
import type { User } from "#shared/types.js";

export function generateToken(user: User) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
  );
}

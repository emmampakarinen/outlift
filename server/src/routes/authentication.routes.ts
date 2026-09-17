import type { CreateUser, User } from "#shared/types.js";
import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
import { generateToken } from "#utils/auth.js";
import bcrypt from "bcrypt";

const authRouter: Router = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    const user: User = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile_picture_url: user.profile_picture_url,
        profile_description: user.profile_description,
      },
    });
  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json("Failed to login");
  }
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const {
    email,
    password,
    username,
    profile_picture_url,
    profile_description,
  } = req.body as CreateUser;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users 
        (email, password_hash, username, profile_picture_url, profile_description)
        VALUES
        ($1, $2, $3, $4, $5)`,
      [
        email,
        password_hash,
        username,
        profile_picture_url,
        profile_description,
      ],
    );

    return res.status(201);
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json("Failed to register user");
  }
});

export default authRouter;

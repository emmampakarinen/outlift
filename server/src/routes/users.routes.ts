import { type Request, type Response, Router } from "express";
import exerciseRouter from "./exercises.routes.ts";
import pool from "../db/db.js";
import type { CreateUser } from "#shared/types.js";

const userRouter: Router = Router();

exerciseRouter.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to delete location:", error);
    res.status(500).json("Failed to delete location");
  }
});

exerciseRouter.post("/", async (req: Request, res: Response) => {
  const {
    email,
    password,
    username,
    profile_picture_url,
    profile_description,
  } = req.body as CreateUser;

  try {
    const result = await pool.query(
      `INSERT INTO users 
        (email, password_hash, username, profile_picture_url, profile_description)
        VALUES
        ($1, $2, $3, $4, $5)`,
      [email, password, username, profile_picture_url, profile_description],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to delete location:", error);
    res.status(500).json("Failed to delete location");
  }
});

exerciseRouter.patch("/:id", async (req: Request, res: Response) => {});

exerciseRouter.delete("/:id", async (req: Request, res: Response) => {});

export default userRouter;

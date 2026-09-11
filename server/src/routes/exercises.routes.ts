import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
const exerciseRouter: Router = Router();

exerciseRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM exercises`);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

exerciseRouter.post("/", async (req: Request, res: Response) => {
  const { name, category, primary_muscle } = req.body;
  const userId = 1; // placeholder for the user ID, replace with actual user ID from authentication
  try {
    const result = await pool.query(
      `INSERT INTO exercises (name, category, primary_muscle, created_by)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
      [name, category, primary_muscle, userId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to add new exercise:", error);
    res.status(500).json({ error: "Failed to add new exercise" });
  }
});

exerciseRouter.delete("/:id", async (req: Request, res: Response) => {
  const exerciseId = req.params.id;
  try {
    // only user-created exercises are allowed to be deleted
    const result = await pool.query(
      `DELETE FROM exercises WHERE id = $1 AND is_default IS FALSE RETURNING *`,
      [exerciseId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Exercise not allowed to delete" });
    }

    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Failed to delete exercise:", error);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

exerciseRouter.patch("/:id", async (req: Request, res: Response) => {
  const { name, category, primary_muscle } = req.body;
  const exerciseId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE exercises
        SET
            name = COALESCE($1, name),
            category = COALESCE($2, category),
            primary_muscle = COALESCE($3, primary_muscle)
        WHERE id = $4`,
      [name, category, primary_muscle, exerciseId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to patch exercise:", error);
    res.status(500).json({ error: "Failed to patch exercise" });
  }
});

export default exerciseRouter;

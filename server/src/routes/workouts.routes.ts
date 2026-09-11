import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
import type { CreateWorkout, Workout } from "#shared/types.js";

const workoutRouter = Router();

workoutRouter.get("/:id", async (req: Request, res: Response) => {
  const locationId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM workouts WHERE location_id = $1",
      [locationId],
    );
    const workouts = result.rows;

    if (workouts.length === 0) {
      return res.status(404).send("No workouts saved for this location");
    }
    return res.json(workouts);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Failed to fetch workouts for location" });
  }
});

workoutRouter.post("/", async (req: Request, res: Response) => {
  const {
    user_id,
    location_id,
    name,
    description,
    duration_minutes,
    exercises,
  } = req.body as CreateWorkout;

  const client = await pool.connect();

  try {
    // create a transaction to ensure the entire operation succeeds or rolls back
    await client.query("BEGIN");

    const workoutResult = await client.query(
      `INSERT INTO workouts
        (user_id, location_id, name, description, duration_minutes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, location_id, name, description, duration_minutes],
    );

    const newWorkout = workoutResult.rows[0];

    for (const exercise of exercises) {
      await client.query(
        `INSERT INTO workout_exercise
          (workout_id, exercise_id, sets, reps, weight)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newWorkout.id,
          exercise.exercise_id,
          exercise.sets,
          exercise.reps,
          exercise.weight,
        ],
      );
    }

    await client.query("COMMIT");

    return res.status(201).json(newWorkout);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add new workout" });
  }
});

workoutRouter.delete("/:id", async (req: Request, res: Response) => {
  const workoutId = req.params.id;

  try {
    const result = await pool.query(
      `
        DELETE FROM workouts WHERE id = $1
      `,
      [workoutId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Requested workout not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete workout" });
  }
});

export default workoutRouter;

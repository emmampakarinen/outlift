import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
import type { CreateWorkout, Workout } from "#shared/types.js";

const workoutRouter = Router();

// get all workouts with exercises for a specific location
workoutRouter.get("/:id", async (req: Request, res: Response) => {
  const locationId = req.params.id;
  try {
    const workoutResult = await pool.query(
      "SELECT * FROM workouts WHERE location_id = $1",
      [locationId],
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({ error: "Workout not found" });
    }

    const workoutsWithExercises = [];

    for (const workout of workoutResult.rows) {
      let workoutId = workout.id;
      const exerciseResult = await pool.query(
        `SELECT
          we.id,
          we.sets,
          we.reps,
          we.weight,
          e.id AS exercise_id,
          e.name,
          e.category,
          e.primary_muscle
          FROM workout_exercise we
          JOIN exercises e ON e.id = we.exercise_id
          WHERE we.workout_id = $1
          `,
        [workoutId],
      );

      workoutsWithExercises.push({
        ...workout,
        exercises: exerciseResult.rows,
      });
    }

    return res.json(workoutsWithExercises);
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

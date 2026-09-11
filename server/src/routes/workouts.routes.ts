import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
import type { CreateWorkout, UpdateWorkout } from "#shared/types.js";

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
    await client.query("ROLLBACK");

    console.log(error);
    return res.status(500).json({ error: "Failed to add new workout" });
  } finally {
    client.release();
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

workoutRouter.patch("/:id", async (req: Request, res: Response) => {
  const { name, description, duration_minutes, location_id, exercises } =
    req.body as UpdateWorkout;
  const workoutId = req.params.id;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (
      name !== undefined ||
      description !== undefined ||
      duration_minutes !== undefined ||
      location_id !== undefined
    ) {
      await client.query(
        `
        UPDATE workouts
        SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          duration_minutes = COALESCE($3, duration_minutes),
          location_id = COALESCE($4, location_id)
        WHERE id = $5
        `,
        [name, description, duration_minutes, location_id, workoutId],
      );
    }

    if (exercises) {
      // get existing exercise IDs for the workout, those that are missing from the updated list will be deleted
      const existingExerciseIds = exercises
        .filter((exercise) => exercise.id !== undefined)
        .map((exercise) => exercise.id);

      // delete exercises that are not in the updated list
      if (existingExerciseIds.length > 0) {
        await client.query(
          ` DELETE FROM workout_exercise
            WHERE workout_id = $1
              AND id != ALL($2::int[])
            `,
          [workoutId, existingExerciseIds],
        );
      } else {
        // if no exercise IDs were found, delete all current exercises from workout
        await client.query(
          `DELETE FROM workout_exercise
            WHERE workout_id = $1
            `,
          [workoutId],
        );
      }

      for (const exercise of exercises) {
        // if exercise already exists --> update otherwise create new exercise
        if (exercise.id) {
          await client.query(
            `
          UPDATE workout_exercise
          SET
            sets = COALESCE($1, sets),
            reps = COALESCE($2, reps),
            weight = COALESCE($3, weight)
          WHERE id = $4
            AND workout_id = $5
          `,
            [
              exercise.sets,
              exercise.reps,
              exercise.weight,
              exercise.id,
              workoutId,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO workout_exercise
              (workout_id, exercise_id, sets, reps, weight)
            VALUES ($1, $2, $3, $4, $5)`,
            [
              workoutId,
              exercise.exercise_id,
              exercise.sets,
              exercise.reps,
              exercise.weight,
            ],
          );
        }
      }
    }

    const result = await client.query(`SELECT * FROM workouts WHERE id = $1`, [
      workoutId,
    ]);

    await client.query("COMMIT");

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Workout not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to patch workout:", error);
    return res.status(500).json({ error: "Failed to patch workout" });
  } finally {
    client.release();
  }
});

export default workoutRouter;

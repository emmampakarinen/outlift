import { type Response, Router } from "express";
import pool from "../db/db.js";
import type {
  AuthRequest,
  CreateWorkout,
  UpdateWorkout,
} from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";

const workoutRouter = Router();

// get user's workouts
workoutRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
      const workoutResult = await pool.query(
        "SELECT * FROM workouts WHERE user_id = $1",
        [userId],
      );

      if (workoutResult.rows.length === 0) {
        return res.status(404).json({ error: "No workouts found" });
      }

      const workoutsWithExercises = [];

      for (const workout of workoutResult.rows) {
        const workoutId = workout.id;

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
          WHERE we.workout_id = $1`,
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
      return res.status(500).json({ error: "Failed to fetch workouts" });
    }
  },
);

// get workout by id
workoutRouter.get(
  "/:workoutId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const workoutId = req.params.workoutId;
    const userId = req.user?.id;

    try {
      const workoutResult = await pool.query(
        `SELECT *
         FROM workouts
         WHERE id = $1
           AND user_id = $2`,
        [workoutId, userId],
      );

      if (workoutResult.rows.length === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

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
        WHERE we.workout_id = $1`,
        [workoutId],
      );

      return res.json({
        ...workoutResult.rows[0],
        exercises: exerciseResult.rows,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to fetch workout" });
    }
  },
);

// get workouts for location
workoutRouter.get(
  "/location/:locationId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const locationId = req.params.locationId;
    const userId = req.user?.id;

    try {
      const workoutResult = await pool.query(
        `SELECT *
         FROM workouts
         WHERE location_id = $1
           AND user_id = $2`,
        [locationId, userId],
      );

      if (workoutResult.rows.length === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

      const workoutsWithExercises = [];

      for (const workout of workoutResult.rows) {
        const workoutId = workout.id;

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
          WHERE we.workout_id = $1`,
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
  },
);

// create workout
workoutRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    const { location_id, name, description, duration_minutes, exercises } =
      req.body as CreateWorkout;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const workoutResult = await client.query(
        `INSERT INTO workouts
          (user_id, location_id, name, description, duration_minutes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, location_id, name, description, duration_minutes],
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
  },
);

// delete workout
workoutRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const workoutId = req.params.id;
    const userId = req.user?.id;

    try {
      const result = await pool.query(
        `DELETE FROM workouts
         WHERE id = $1
           AND user_id = $2`,
        [workoutId, userId],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Requested workout not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to delete workout" });
    }
  },
);

// update workout
workoutRouter.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const workoutId = req.params.id;

    const { name, description, duration_minutes, location_id, exercises } =
      req.body as UpdateWorkout;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const workoutExists = await client.query(
        `SELECT id
         FROM workouts
         WHERE id = $1
           AND user_id = $2`,
        [workoutId, userId],
      );

      if (workoutExists.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Workout not found" });
      }

      if (
        name !== undefined ||
        description !== undefined ||
        duration_minutes !== undefined ||
        location_id !== undefined
      ) {
        await client.query(
          `UPDATE workouts
           SET
             name = COALESCE($1, name),
             description = COALESCE($2, description),
             duration_minutes = COALESCE($3, duration_minutes),
             location_id = COALESCE($4, location_id)
           WHERE id = $5
             AND user_id = $6`,
          [name, description, duration_minutes, location_id, workoutId, userId],
        );
      }

      if (exercises) {
        const existingExerciseIds = exercises
          .filter((exercise) => exercise.id !== undefined)
          .map((exercise) => exercise.id);

        if (existingExerciseIds.length > 0) {
          await client.query(
            `DELETE FROM workout_exercise
             WHERE workout_id = $1
               AND id != ALL($2::int[])`,
            [workoutId, existingExerciseIds],
          );
        } else {
          await client.query(
            `DELETE FROM workout_exercise
             WHERE workout_id = $1`,
            [workoutId],
          );
        }

        for (const exercise of exercises) {
          if (exercise.id) {
            await client.query(
              `UPDATE workout_exercise
               SET
                 sets = COALESCE($1, sets),
                 reps = COALESCE($2, reps),
                 weight = COALESCE($3, weight)
               WHERE id = $4
                 AND workout_id = $5`,
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

      const result = await client.query(
        `SELECT *
         FROM workouts
         WHERE id = $1
           AND user_id = $2`,
        [workoutId, userId],
      );

      await client.query("COMMIT");

      return res.json(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Failed to patch workout:", error);
      return res.status(500).json({ error: "Failed to patch workout" });
    } finally {
      client.release();
    }
  },
);

export default workoutRouter;

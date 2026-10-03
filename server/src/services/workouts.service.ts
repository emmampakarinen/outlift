import type { CreateWorkout, UpdateWorkout } from "#shared/types.js";
import pool from "../db/db.js";

// get user's workouts
export async function getUserWorkout(userId: number) {
  const workoutResult = await pool.query(
    `
      SELECT
        w.*,
        l.name AS location_name
      FROM workouts w
      JOIN locations l ON l.id = w.location_id
      WHERE w.user_id = $1
    `,
    [userId],
  );

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
      location: {
        id: workout.location_id,
        name: workout.location_name,
      },
      exercises: exerciseResult.rows,
    });
  }

  return workoutsWithExercises;
}

// get workout by id
export async function getWorkoutById(userId: number, workoutId: number) {
  const workoutResult = await pool.query(
    `
      SELECT
        w.*,
        l.name AS location_name
      FROM workouts w
      JOIN locations l ON l.id = w.location_id
      WHERE w.user_id = $1 AND w.id = $2
    `,
    [userId, workoutId],
  );

  if (workoutResult.rows.length === 0) {
    return false;
  }

  const workout = workoutResult.rows[0];

  const exerciseResult = await pool.query(
    `
      SELECT
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

  const { location_name, ...workoutData } = workout;

  return {
    ...workoutData,
    location: {
      id: workout.location_id,
      name: location_name,
    },
    exercises: exerciseResult.rows,
  };
}

// get workouts for location
export async function getLocationWorkouts(userId: number, locationId: number) {
  const workoutResult = await pool.query(
    `SELECT *
         FROM workouts
         WHERE location_id = $1
           AND user_id = $2`,
    [locationId, userId],
  );

  if (workoutResult.rows.length === 0) {
    return [];
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

  return workoutsWithExercises;
}

// create workout
export async function createWorkout(
  userId: number,
  newWorkoutData: CreateWorkout,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workoutResult = await client.query(
      `INSERT INTO workouts
        (
          user_id,
          location_id,
          name,
          description,
          duration_minutes,
          intensity,
          workout_type,
          muscle_group
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        newWorkoutData.locationId,
        newWorkoutData.name,
        newWorkoutData.description,
        newWorkoutData.durationMinutes,
        newWorkoutData.intensity,
        newWorkoutData.workoutType,
        newWorkoutData.muscleGroup,
      ],
    );

    const newWorkout = workoutResult.rows[0];

    for (const exercise of newWorkoutData.exercises) {
      await client.query(
        `INSERT INTO workout_exercise
          (workout_id, exercise_id, sets, reps, weight)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newWorkout.id,
          exercise.exerciseId,
          exercise.sets,
          exercise.reps,
          exercise.weight,
        ],
      );
    }

    await client.query("COMMIT");

    return newWorkout;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// delete workout
export async function deleteWorkout(userId: number, workoutId: number) {
  const result = await pool.query(
    `DELETE FROM workouts
         WHERE id = $1
           AND user_id = $2`,
    [workoutId, userId],
  );

  if (result.rowCount === 0) {
    return false;
  }

  return true;
}

// update workout
export async function updateWorkout(
  userId: number,
  workoutId: number,
  updateWorkoutData: UpdateWorkout,
) {
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
      return false;
    }

    if (
      updateWorkoutData.name !== undefined ||
      updateWorkoutData.description !== undefined ||
      updateWorkoutData.durationMinutes !== undefined ||
      updateWorkoutData.locationId !== undefined ||
      updateWorkoutData.intensity !== undefined ||
      updateWorkoutData.workoutType !== undefined ||
      updateWorkoutData.muscleGroup !== undefined
    ) {
      await client.query(
        `UPDATE workouts
   SET
     name = COALESCE($1, name),
     description = COALESCE($2, description),
     duration_minutes = COALESCE($3, duration_minutes),
     location_id = COALESCE($4, location_id),
     intensity = COALESCE($5, intensity),
     workout_type = COALESCE($6, workout_type),
     muscle_group = COALESCE($7, muscle_group)
   WHERE id = $8
     AND user_id = $9`,
        [
          updateWorkoutData.name,
          updateWorkoutData.description,
          updateWorkoutData.durationMinutes,
          updateWorkoutData.locationId,
          updateWorkoutData.intensity,
          updateWorkoutData.workoutType,
          updateWorkoutData.muscleGroup,
          workoutId,
          userId,
        ],
      );
    }

    if (updateWorkoutData.exercises) {
      const existingExerciseIds = updateWorkoutData.exercises
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

      for (const exercise of updateWorkoutData.exercises) {
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
              exercise.exerciseId,
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

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

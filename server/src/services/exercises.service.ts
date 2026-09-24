import pool from "../db/db.js";

export async function getExercises() {
  const result = await pool.query(`SELECT * FROM exercises`);

  return result.rows;
}

export async function createExercise(
  name: string,
  category: string,
  primary_muscle: string,
  userId: number,
) {
  const result = await pool.query(
    `INSERT INTO exercises (name, category, primary_muscle, created_by)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
    [name, category, primary_muscle, userId],
  );

  return result.rows[0];
}

export async function deleteExercise(exerciseId: number) {
  // only user-created exercises are allowed to be deleted
  const result = await pool.query(
    `DELETE FROM exercises WHERE id = $1 AND is_default IS FALSE RETURNING *`,
    [exerciseId],
  );

  return result.rowCount !== 0;
}

export async function editExercise(
  name: string,
  category: string,
  primary_muscle: string,
  exerciseId: number,
) {
  const result = await pool.query(
    `UPDATE exercises
        SET
            name = COALESCE($1, name),
            category = COALESCE($2, category),
            primary_muscle = COALESCE($3, primary_muscle)
        WHERE id = $4
        RETURNING *`,
    [name, category, primary_muscle, exerciseId],
  );

  return result.rows[0];
}

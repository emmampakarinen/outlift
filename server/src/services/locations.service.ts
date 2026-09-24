import pool from "../db/db.js";

// get user's locations
export async function getUserLocations(userId: number) {
  const locations = await pool.query(
    "SELECT * FROM locations WHERE created_by = $1",
    [userId],
  );

  return locations.rows;
}

// get location by id
export async function getLocationById(locationId: number, userId: number) {
  const result = await pool.query(
    `SELECT *
         FROM locations
         WHERE id = $1
           AND created_by = $2`,
    [locationId, userId],
  );

  return result.rows[0];
}

// create location
export async function createLocation(
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  userId: number,
  type?: string,
  description?: string,
) {
  const newLocation = await pool.query(
    `INSERT INTO locations
          (name, address, type, latitude, longitude, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
    [name, address, type, latitude, longitude, description, userId],
  );

  return newLocation.rows[0];
}

// delete location
export async function deleteLocation(locationId: number, userId: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const location = await client.query(
      `SELECT id
       FROM locations
       WHERE id = $1
         AND created_by = $2`,
      [locationId, userId],
    );

    await client.query(
      `DELETE FROM workouts
         WHERE location_id = $1`,
      [locationId],
    );

    await client.query(
      `DELETE FROM location_equipment
         WHERE location_id = $1`,
      [locationId],
    );

    const result = await client.query(
      `DELETE FROM locations
         WHERE id = $1
           AND created_by = $2`,
      [locationId, userId],
    );

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// update location
export async function updateLocation(
  locationId: number,
  userId: number,
  name: string,
  description: string,
) {
  const result = await pool.query(
    `UPDATE locations
         SET
           name = COALESCE($1, name),
           description = COALESCE($2, description)
         WHERE id = $3
           AND created_by = $4
         RETURNING *`,
    [name, description, locationId, userId],
  );

  return result.rows[0];
}

// get location equipment
export async function getLocationEquipment(locationId: number, userId: number) {
  const result = await pool.query(
    `SELECT equipment.id, equipment.name
         FROM location_equipment
         INNER JOIN equipment
           ON location_equipment.equipment_id = equipment.id
         INNER JOIN locations
           ON locations.id = location_equipment.location_id
         WHERE location_equipment.location_id = $1
           AND locations.created_by = $2`,
    [locationId, userId],
  );

  return result.rows;
}

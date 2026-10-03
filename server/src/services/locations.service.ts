import { mapLocation } from "#utils/helpers.js";
import pool from "../db/db.js";

// both user's and public locations
export async function getLocations(userId: number) {
  const result = await pool.query(
    "SELECT * FROM locations WHERE created_by = $1 OR is_public = true",
    [userId],
  );
  return result.rows.map(mapLocation);
}

// get location by id
export async function getLocationById(locationId: number, userId: number) {
  const result = await pool.query(
    `SELECT *
         FROM locations
         WHERE id = $1
           AND (created_by = $2 OR is_public = true)`,
    [locationId, userId],
  );
  const row = result.rows[0];

  return row ? mapLocation(row) : undefined;
}

// create location
export async function createLocation(
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  userId: number,
  isPublic: boolean,
  type?: string,
  description?: string,
) {
  const newLocation = await pool.query(
    `INSERT INTO locations
          (name, address, type, latitude, longitude, description, is_public, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
    [name, address, type, latitude, longitude, description, isPublic, userId],
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
  isPublic: boolean,
) {
  const result = await pool.query(
    `UPDATE locations
         SET
           name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_public = $3
         WHERE id = $4
           AND created_by = $5
         RETURNING *`,
    [name, description, isPublic, locationId, userId],
  );

  return result.rows[0];
}

// get location equipment
export async function getLocationEquipment(locationId: number, userId: number) {
  const result = await pool.query(
    `SELECT equipment.id, equipment.name, equipment.type
         FROM location_equipment
         INNER JOIN equipment
           ON location_equipment.equipment_id = equipment.id
         INNER JOIN locations
           ON locations.id = location_equipment.location_id
         WHERE location_equipment.location_id = $1
           AND (locations.created_by = $2 OR locations.is_public = true)`,
    [locationId, userId],
  );

  return result.rows;
}

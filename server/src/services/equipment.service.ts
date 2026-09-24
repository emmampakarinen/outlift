import pool from "../db/db.js";

// get all equipment
export async function getEquipment() {
  const equipments = await pool.query("SELECT * FROM equipment");

  return equipments.rows;
}

// adding equipment to location after creating new location
export async function addLocationEquipment(
  locationId: number,
  equipmentIds: number[],
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const id of equipmentIds) {
      await client.query(
        `INSERT INTO location_equipment
          (location_id, equipment_id)
         VALUES ($1, $2)`,
        [locationId, id],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// route for editing location's equipment
export async function editLocationEquipment(
  locationId: number,
  equipmentIds: number[],
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM location_equipment WHERE location_id = $1",
      [locationId],
    );

    for (const id of equipmentIds) {
      await client.query(
        "INSERT INTO location_equipment (location_id, equipment_id) VALUES ($1, $2)",
        [locationId, id],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to patch equipments:", error);

    throw error;
  } finally {
    client.release();
  }
}

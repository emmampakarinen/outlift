import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";
import type { Location } from "#shared/types.js";

const locationRouter: Router = Router();

locationRouter.get("/", async (req: Request, res: Response) => {
  try {
    const locations = await pool.query("SELECT * FROM locations");
    res.json(locations.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

locationRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const location = await pool.query("SELECT * FROM locations WHERE id = $1", [
      id,
    ]);

    if (location.rows.length === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }
    res.json(location.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

locationRouter.post("/", async (req: Request, res: Response) => {
  const { name, latitude, longitude, description, created_by } =
    req.body as Location;

  try {
    const newLocation = await pool.query(
      `INSERT INTO locations
       (name, latitude, longitude, description, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, latitude, longitude, description, created_by],
    );

    res.status(201).json(newLocation.rows[0]);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    res.status(500).json({ error: "Failed to add new location" });
  }
});

locationRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await pool.query(`DELETE FROM locations WHERE id = $1`, [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Requested location not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete location:", error);
    res.status(500).json("Failed to delete location");
  }
});

locationRouter.patch("/:id", async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const locationId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE locations
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description)
        WHERE id = $3
        RETURNING *`,
      [name, description, locationId],
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to patch location:", error);
    res.status(500).json("Failed to patch location");
  }
});

locationRouter.get("/:id/equipment", async (req: Request, res: Response) => {
  const locationId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT equipment.id, equipment.name
      FROM location_equipment
      INNER JOIN equipment
      ON location_equipment.equipment_id = equipment.id
      WHERE location_equipment.location_id = $1`,
      [locationId],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Failed to get location's equipment:", error);
    res.status(500).json("Failed to get location's equipment");
  }
});

locationRouter.post("/:id/equipment", async (req: Request, res: Response) => {
  const equipmentIds = req.body.equipmentIds;
  const locationId = req.params.id;

  try {
    await pool.query(
      `INSERT INTO location_equipment (location_id, equipment_id)
        SELECT $1, UNNEST($2::int[])`,
      [locationId, equipmentIds],
    );

    return res.status(201).json({
      message: "Equipment added to location",
    });
  } catch (error) {
    console.error("Failed to add location's equipment:", error);
    res.status(500).json("Failed to add location's equipment");
  }
});

locationRouter.delete(
  "/:id/equipment/:equipmentId",
  async (req: Request, res: Response) => {
    const equipmentId = req.params.equipmentId;
    const locationId = req.params.id;

    try {
      const result = await pool.query(
        `
          DELETE FROM location_equipment
          WHERE location_id = $1
          AND equipment_id = $2
        `,
        [locationId, equipmentId],
      );

      return res.status(201).json({
        message: "Equipment deleted from location",
      });
    } catch (error) {
      console.error("Failed to delete location's equipment:", error);
      res.status(500).json("Failed to delete location's equipment");
    }
  },
);

export default locationRouter;

import { type Response, Router } from "express";
import pool from "../db/db.js";
import type { AuthRequest, CreateLocation } from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";

const locationRouter: Router = Router();

// get user's locations
locationRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
      const locations = await pool.query(
        "SELECT * FROM locations WHERE created_by = $1",
        [userId],
      );

      return res.json(locations.rows);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      return res.status(500).json({ error: "Failed to fetch locations" });
    }
  },
);

// get location by id
locationRouter.get(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const locationId = req.params.id;
    const userId = req.user?.id;

    try {
      const location = await pool.query(
        `SELECT *
         FROM locations
         WHERE id = $1
           AND created_by = $2`,
        [locationId, userId],
      );

      if (location.rows.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.json(location.rows[0]);
    } catch (error) {
      console.error("Failed to fetch location:", error);
      return res.status(500).json({ error: "Failed to fetch location" });
    }
  },
);

// create location
locationRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    console.log(userId, req.body);

    const { name, address, type, latitude, longitude, description } =
      req.body as CreateLocation;

    try {
      const newLocation = await pool.query(
        `INSERT INTO locations
          (name, address, type, latitude, longitude, description, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, address, type, latitude, longitude, description, userId],
      );

      return res.status(201).json(newLocation.rows[0]);
    } catch (error) {
      console.error("Failed to add location:", error);
      return res.status(500).json({ error: "Failed to add new location" });
    }
  },
);

// delete location
locationRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const locationId = req.params.id;
    const userId = req.user?.id;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

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

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Requested location not found" });
      }

      await client.query("COMMIT");

      return res.status(204).send();
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Failed to delete location:", error);
      return res.status(500).json({ error: "Failed to delete location" });
    } finally {
      client.release();
    }
  },
);

// update location
locationRouter.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const locationId = req.params.id;
    const userId = req.user?.id;

    try {
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

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to patch location:", error);
      return res.status(500).json({ error: "Failed to patch location" });
    }
  },
);

// get location equipment
locationRouter.get(
  "/:id/equipment",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const locationId = req.params.id;
    const userId = req.user?.id;

    try {
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

      return res.json(result.rows);
    } catch (error) {
      console.error("Failed to get location's equipment:", error);
      return res
        .status(500)
        .json({ error: "Failed to get location's equipment" });
    }
  },
);

export default locationRouter;

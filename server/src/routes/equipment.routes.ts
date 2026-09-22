import { type Response, Router } from "express";
import pool from "../db/db.js";
import type { AuthRequest } from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";

const equipmentRouter: Router = Router();

// get all equipment
equipmentRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const equipments = await pool.query("SELECT * FROM equipment");

      return res.json(equipments.rows);
    } catch (error) {
      console.error("Failed to fetch equipments:", error);
      return res.status(500).json({ error: "Failed to fetch equipments" });
    }
  },
);

equipmentRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { locationId, equipmentIds } = req.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const id of equipmentIds) {
        await client.query(
          "INSERT INTO location_equipment (location_id, equipment_id) VALUES ($1, $2)",
          [locationId, id],
        );
      }

      await client.query("COMMIT");

      return res.status(201).json({ message: "Equipments added to location" });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Failed to add equipments:", error);

      return res.status(500).json({
        error: "Failed to add equipments",
      });
    } finally {
      client.release();
    }
  },
);

// TODO delete equipment from location
equipmentRouter.delete(
  "/:id/equipment/:equipmentId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const equipmentId = req.params.equipmentId;
    const locationId = req.params.id;
    const userId = req.user?.id;

    try {
      // make sure the location belongs to this user
      const location = await pool.query(
        `SELECT id
         FROM locations
         WHERE id = $1
           AND created_by = $2`,
        [locationId, userId],
      );

      if (location.rowCount === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      const result = await pool.query(
        `DELETE FROM location_equipment
         WHERE location_id = $1
           AND equipment_id = $2`,
        [locationId, equipmentId],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Failed to delete location's equipment:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete location's equipment" });
    }
  },
);

export default equipmentRouter;

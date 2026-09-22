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

// adding equipment to location after creating new location
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

// route for editing location's equipment
equipmentRouter.patch(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { locationId, equipmentIds } = req.body;
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

      return res
        .status(201)
        .json({ message: "Equipments patched to location" });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("Failed to patch equipments:", error);

      return res.status(500).json({
        error: "Failed to patch equipments",
      });
    } finally {
      client.release();
    }
  },
);

export default equipmentRouter;

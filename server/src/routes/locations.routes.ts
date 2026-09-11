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

export default locationRouter;

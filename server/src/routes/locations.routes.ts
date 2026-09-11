import { type Request, type Response, Router } from "express";
import pool from "../db/db.js";

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

export default locationRouter;

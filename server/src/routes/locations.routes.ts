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

export default locationRouter;

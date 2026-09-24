import { type Response, Router } from "express";
import type { AuthRequest } from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import {
  addLocationEquipment,
  editLocationEquipment,
  getEquipment,
} from "../services/equipment.service.ts";

const equipmentRouter: Router = Router();

// get all equipment
equipmentRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const equipments = await getEquipment();

      return res.json(equipments);
    } catch (error) {
      console.error("Failed to fetch equipments:", error);

      return res.status(500).json({
        error: "Failed to fetch equipments",
      });
    }
  },
);

// adding equipment to location after creating new location
equipmentRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { locationId, equipmentIds } = req.body;

    try {
      await addLocationEquipment(locationId, equipmentIds);

      return res.status(201).json({
        message: "Equipments added to location",
      });
    } catch (error) {
      console.error("Failed to add equipments:", error);

      return res.status(500).json({
        error: "Failed to add equipments",
      });
    }
  },
);

// editing location's equipment
equipmentRouter.patch(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { locationId, equipmentIds } = req.body;

    try {
      await editLocationEquipment(locationId, equipmentIds);

      return res.status(200).json({
        message: "Equipments updated for location",
      });
    } catch (error) {
      console.error("Failed to patch equipments:", error);

      return res.status(500).json({
        error: "Failed to patch equipments",
      });
    }
  },
);

export default equipmentRouter;

import { type Response, Router } from "express";

import type { AuthRequest, CreateLocation } from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import {
  createLocation,
  deleteLocation,
  getLocationById,
  getLocationEquipment,
  getUserLocations,
  updateLocation,
} from "#services/locations.service.js";

const locationRouter: Router = Router();

// get user's locations
locationRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    try {
      const locations = await getUserLocations(userId);

      return res.json(locations);
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
    const locationId = Number(req.params.id);
    const userId = req.user!.id;

    try {
      const location = await getLocationById(locationId, userId);

      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.json(location);
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

    const { name, address, type, latitude, longitude, description } =
      req.body as CreateLocation;

    try {
      const location = await createLocation(
        name,
        address,
        latitude,
        longitude,
        userId,
        type,
        description,
      );

      return res.status(201).json(location);
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
    const locationId = Number(req.params.id);
    const userId = req.user!.id;

    try {
      const result = await deleteLocation(locationId, userId);

      if (!result) {
        return res.status(404).json({ error: "Requested location not found" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Failed to delete location:", error);
      return res.status(500).json({ error: "Failed to delete location" });
    }
  },
);

// update location
locationRouter.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const locationId = Number(req.params.id);
    const userId = req.user!.id;

    try {
      const location = await updateLocation(
        locationId,
        userId,
        name,
        description,
      );

      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.status(200).json(location);
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
    const locationId = Number(req.params.id);
    const userId = req.user!.id;

    try {
      const equipment = await getLocationEquipment(locationId, userId);

      return res.json(equipment);
    } catch (error) {
      console.error("Failed to get location's equipment:", error);
      return res
        .status(500)
        .json({ error: "Failed to get location's equipment" });
    }
  },
);

export default locationRouter;

import { type Response, Router } from "express";
import type {
  AuthRequest,
  CreateWorkout,
  UpdateWorkout,
} from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import {
  createWorkout,
  deleteWorkout,
  getLocationWorkouts,
  getUserWorkout,
  getWorkoutById,
  updateWorkout,
} from "../services/workouts.service.ts";

const workoutRouter = Router();

// get user's workouts
workoutRouter.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    try {
      const workouts = await getUserWorkout(userId);

      return res.json(workouts);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);

      return res.status(500).json({
        error: "Failed to fetch workouts",
      });
    }
  },
);

// get workouts for location
workoutRouter.get(
  "/location/:locationId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const locationId = Number(req.params.locationId);

    if (Number.isNaN(locationId)) {
      return res.status(400).json({
        error: "Invalid location id",
      });
    }

    try {
      const workouts = await getLocationWorkouts(userId, locationId);

      return res.json(workouts);
    } catch (error) {
      console.error("Failed to fetch workouts for location:", error);

      return res.status(500).json({
        error: "Failed to fetch workouts for location",
      });
    }
  },
);

// get workout by id
workoutRouter.get(
  "/:workoutId",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const workoutId = Number(req.params.workoutId);

    if (Number.isNaN(workoutId)) {
      return res.status(400).json({
        error: "Invalid workout id",
      });
    }

    try {
      const workout = await getWorkoutById(userId, workoutId);

      if (!workout) {
        return res.status(404).json({
          error: "Workout not found",
        });
      }

      return res.json(workout);
    } catch (error) {
      console.error("Failed to fetch workout:", error);

      return res.status(500).json({
        error: "Failed to fetch workout",
      });
    }
  },
);

// create workout
workoutRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const newWorkoutData = req.body as CreateWorkout;

    try {
      const workout = await createWorkout(userId, newWorkoutData);

      return res.status(201).json(workout);
    } catch (error) {
      console.error("Failed to add new workout:", error);

      return res.status(500).json({
        error: "Failed to add new workout",
      });
    }
  },
);

// delete workout
workoutRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const workoutId = Number(req.params.id);

    if (Number.isNaN(workoutId)) {
      return res.status(400).json({
        error: "Invalid workout id",
      });
    }

    try {
      const deleted = await deleteWorkout(userId, workoutId);

      if (!deleted) {
        return res.status(404).json({
          error: "Requested workout not found",
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Failed to delete workout:", error);

      return res.status(500).json({
        error: "Failed to delete workout",
      });
    }
  },
);

// update workout
workoutRouter.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const workoutId = Number(req.params.id);
    const updateWorkoutData = req.body as UpdateWorkout;

    if (Number.isNaN(workoutId)) {
      return res.status(400).json({
        error: "Invalid workout id",
      });
    }

    try {
      const workout = await updateWorkout(userId, workoutId, updateWorkoutData);

      if (!workout) {
        return res.status(404).json({
          error: "Workout not found",
        });
      }

      return res.json(workout);
    } catch (error) {
      console.error("Failed to patch workout:", error);

      return res.status(500).json({
        error: "Failed to patch workout",
      });
    }
  },
);

export default workoutRouter;

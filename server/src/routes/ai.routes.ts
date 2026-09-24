import { generateWorkout } from "#services/claude.service.js";
import { Router, type Response } from "express";
import {
  getLocationById,
  getLocationEquipment,
} from "#services/locations.service.js";
import { getExercises } from "#services/exercises.service.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import type { AuthRequest } from "#shared/types.js";

const aiRouter: Router = Router();

type Specs = {
  locationId: number;
  userId: number;
  duration: number;
  intensity: string;
  workoutType: string;
  muscleGroup: string;
};

aiRouter.post(
  "/workouts/generate",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { locationId, duration, intensity, workoutType, muscleGroup } =
      req.body as Specs;

    const userId = req.user!.id;

    const location = await getLocationById(locationId, userId);
    const equipment = await getLocationEquipment(locationId, userId);
    const exercises = await getExercises();

    const workout = await generateWorkout({
      location,
      equipment,
      exercises,
      preferences: {
        duration,
        intensity,
        workoutType,
        muscleGroup,
      },
    });

    res.json(workout);
  },
);

export default aiRouter;

import { generateWorkout } from "#services/claude.service.js";
import { Router, type Response } from "express";
import {
  getLocationById,
  getLocationEquipment,
} from "#services/locations.service.js";
import { getExercises } from "#services/exercises.service.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import type { AuthRequest, GeneratedWorkout } from "#shared/types.js";

const aiRouter: Router = Router();

type Specs = {
  locationId: number;
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

    const equipment = await getLocationEquipment(locationId, userId);
    const exercises = await getExercises();

    const generatedWorkout: GeneratedWorkout = await generateWorkout({
      equipment,
      exercises,
      preferences: {
        duration,
        intensity,
        workoutType,
        muscleGroup,
      },
    });

    const mappedExercises = generatedWorkout.exercises.map(
      (generatedExercise) => {
        const exercise = exercises.find(
          (exercise) => exercise.id === generatedExercise.exerciseId,
        );

        if (!exercise) {
          throw new Error(`Exercise ${generatedExercise.exerciseId} not found`);
        }

        return {
          exercise_id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          primary_muscle: exercise.primary_muscle,
          sets: generatedExercise.sets,
          reps: generatedExercise.reps,
          weight: null,
          restSeconds: generatedExercise.restSeconds,
        };
      },
    );

    return res.status(200).json({
      name: generatedWorkout.name,
      description: generatedWorkout.description,
      duration_minutes: generatedWorkout.duration,
      exercises: mappedExercises,
    });
  },
);

export default aiRouter;

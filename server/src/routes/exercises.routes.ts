import { type Response, Router } from "express";

import type { AuthRequest } from "#shared/types.js";
import { authenticateToken } from "#middleware/authMiddleware.js";
import {
  createExercise,
  deleteExercise,
  editExercise,
  getExercises,
} from "#services/exercises.service.js";

const exerciseRouter: Router = Router();

// get all exercises
exerciseRouter.get(
  "/",
  authenticateToken,
  async (_req: AuthRequest, res: Response) => {
    try {
      const exercises = await getExercises();

      return res.status(200).json(exercises);
    } catch (error) {
      console.error("Failed to fetch exercises:", error);

      return res.status(500).json({
        error: "Failed to fetch exercises",
      });
    }
  },
);

// create exercise
exerciseRouter.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { name, category, primary_muscle } = req.body;
    const userId = req.user!.id;

    try {
      const exercise = await createExercise(
        name,
        category,
        primary_muscle,
        userId,
      );

      return res.status(201).json(exercise);
    } catch (error) {
      console.error("Failed to add new exercise:", error);

      return res.status(500).json({
        error: "Failed to add new exercise",
      });
    }
  },
);

// delete exercise
exerciseRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const exerciseId = Number(req.params.id);

    try {
      const deleted = await deleteExercise(exerciseId);

      if (!deleted) {
        return res.status(404).json({
          error: "Exercise not found or not allowed to delete",
        });
      }

      return res.status(200).json({
        message: "Exercise deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete exercise:", error);

      return res.status(500).json({
        error: "Failed to delete exercise",
      });
    }
  },
);

// update exercise
exerciseRouter.patch(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    const { name, category, primary_muscle } = req.body;
    const exerciseId = Number(req.params.id);

    try {
      const exercise = await editExercise(
        name,
        category,
        primary_muscle,
        exerciseId,
      );

      if (!exercise) {
        return res.status(404).json({
          error: "Exercise not found",
        });
      }

      return res.status(200).json(exercise);
    } catch (error) {
      console.error("Failed to patch exercise:", error);

      return res.status(500).json({
        error: "Failed to patch exercise",
      });
    }
  },
);

export default exerciseRouter;

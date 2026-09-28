import type { GeneratedWorkout, GenerateWorkoutInput } from "../shared/types";
import { apiRequest } from "./apiRequest";

export function generateWorkout(input: GenerateWorkoutInput, token: string) {
  return apiRequest<GeneratedWorkout>("/ai/workouts/generate", {
    token,
    method: "POST",
    body: input,
  });
}

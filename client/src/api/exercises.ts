import type { Exercise } from "../shared/types";
import { apiRequest } from "./apiRequest";

export function getExercises(token: string) {
  return apiRequest<Exercise[]>("/exercises/", {
    token,
  });
}

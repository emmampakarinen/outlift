import type { CreateWorkout, UpdateWorkout, Workout } from "../shared/types";
import { apiRequest } from "./apiRequest";

export function getWorkouts(token: string) {
  return apiRequest<Workout[]>("/workouts/", {
    token,
  });
}

export function getWorkoutsByLocation(locationId: number, token: string) {
  return apiRequest<Workout[]>(`/workouts/location/${locationId}`, {
    token,
  });
}

export function getWorkoutById(workoutId: number, token: string) {
  return apiRequest<Workout>(`/workouts/${workoutId}`, {
    token,
  });
}

export function editWorkout(
  workout: UpdateWorkout,
  workoutId: number,
  token: string,
) {
  return apiRequest<Workout>(`/workouts/${workoutId}`, {
    method: "PATCH",
    token,
    body: workout,
  });
}

export function createWorkout(workout: CreateWorkout, token: string) {
  return apiRequest<Workout>("/workouts/", {
    method: "POST",
    token,
    body: workout,
  });
}

export function deleteWorkout(workoutId: number, token: string) {
  return apiRequest<void>(`/workouts/${workoutId}`, {
    method: "DELETE",
    token,
  });
}

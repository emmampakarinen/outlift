import type { CreateWorkout, UpdateWorkout, Workout } from "../shared/types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(`${API_URL}/workouts/`);
  if (!response.ok) {
    throw new Error("Failed to fetch workouts");
  }
  return response.json();
}

export async function getWorkoutsByLocation(locationId: number) {
  const response = await fetch(`${API_URL}/workouts/location/${locationId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workouts for location");
  }

  return response.json();
}

export async function getWorkoutById(workoutId: number) {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch workout");
  }

  return response.json();
}

export async function editWorkout(workout: UpdateWorkout, workoutId: number) {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  });

  if (!response.ok) {
    throw new Error("Failed to patch workout");
  }

  return response.json();
}

export async function createWorkout(workout: CreateWorkout) {
  const response = await fetch(`${API_URL}/workouts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  });

  if (!response.ok) {
    throw new Error("Failed to patch workout");
  }

  return response.json();
}

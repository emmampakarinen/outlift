import type { Request } from "express";
export interface CreateUser {
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  username: string;
  profile_picture_url?: string;
  profile_description?: string;
  created_at: Date;
}

export interface CreateLocation {
  name: string;
  address: string;
  type?: string;
  description?: string;
  latitude: number;
  longitude: number;
  equipmentIds: number[];
}

export interface CreateWorkout {
  user_id: number;
  location_id: number;
  name: string;
  description?: string;
  duration_minutes?: number;
  intensity: WorkoutIntensity;
  workout_type: WorkoutType;
  muscle_group: MuscleGroup;
  exercises: {
    exercise_id: number;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  duration_minutes?: number;
  location_id?: number;
  intensity?: WorkoutIntensity;
  workout_type?: WorkoutType;
  muscle_group?: MuscleGroup;
  exercises?: {
    id: number; // workout_exercise row id
    exercise_id: number; // exercise id
    sets?: number;
    reps?: number;
    weight?: number;
  }[];
}

export interface JwtPayload {
  id: number;
  username: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const WORKOUT_INTENSITIES = [
  "easy",
  "moderate",
  "hard",
  "all-out",
] as const;

export type WorkoutIntensity = (typeof WORKOUT_INTENSITIES)[number];

export const WORKOUT_TYPES = [
  "strength",
  "hiit",
  "cardio",
  "mobility",
  "endurance",
  "circuit",
  "mixed",
] as const;

export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export const MUSCLE_GROUPS = [
  "full-body",
  "upper-body",
  "lower-body",
  "core",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

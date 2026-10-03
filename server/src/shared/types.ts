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
  profilePictureUrl?: string;
  profileDescription?: string;
  createdAt: Date;
}

export interface CreateLocation {
  name: string;
  address: string;
  type?: string;
  description?: string;
  latitude: number;
  longitude: number;
  equipmentIds: number[];
  isPublic: boolean;
}

export interface LocationRow {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string | null;
  type: string | null;
  is_public: boolean;
  created_by: number;
  created_at: Date;
}

export interface CreateWorkout {
  userId: number;
  locationId: number;
  name: string;
  description?: string;
  durationMinutes?: number;
  intensity: WorkoutIntensity;
  workoutType: WorkoutType;
  muscleGroup: MuscleGroup;
  exercises: {
    exerciseId: number;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  durationMinutes?: number;
  locationId?: number;
  intensity?: WorkoutIntensity;
  workoutType?: WorkoutType;
  muscleGroup?: MuscleGroup;
  exercises?: {
    id: number; // workout_exercise row id
    exerciseId: number; // exercise id
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

export type GeneratedWorkout = {
  name: string;
  description: string;
  duration: number;
  exercises: {
    exerciseId: number;
    sets: number;
    reps: number;
    restSeconds: number;
  }[];
};

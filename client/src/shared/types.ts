export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  created_by: number;
  created_at: Date;
}

export interface WorkoutExercise {
  id?: number;
  exercise_id: number;
  name: string;
  category: string;
  primary_muscle: string;
  sets: number;
  reps: number;
  weight: number | null;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  primary_muscle: string;
}

export interface Workout {
  id: number;
  user_id: number;
  location_id: number | null;
  name: string;
  description?: string;
  duration_minutes: number;
  intensity?: WorkoutIntensity;
  workout_type?: WorkoutType;
  muscle_group?: MuscleGroup;
  created_at: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutDraft {
  location_id: number;
  name: string;
  description: string;
  duration_minutes: string;
  intensity: WorkoutIntensity;
  workout_type: WorkoutType;
  muscle_group: MuscleGroup;
  exercises: WorkoutExercise[];
}

export interface CreateWorkout {
  user_id: number;
  location_id: number;
  name: string;
  description: string;
  duration_minutes: number;
  intensity: WorkoutIntensity;
  workout_type: WorkoutType;
  muscle_group: MuscleGroup;
  exercises: WorkoutExercise[];
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  duration_minutes?: number;
  location_id?: number;

  intensity?: WorkoutIntensity;
  workout_type?: WorkoutType;
  muscle_group?: MuscleGroup;

  exercises?: WorkoutExercise[];
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  profile_picture_url?: string;
  profile_description?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export interface CreateUser {
  email: string;
  password: string;
  username: string;
}

export interface CreateLocationData {
  name: string;
  address?: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export type EquipmentType =
  | "bodyweight"
  | "strength"
  | "cardio"
  | "balance"
  | "mobility"
  | "functional"
  | "other";

export const EQUIPMENT_TYPES: EquipmentType[] = [
  "bodyweight",
  "strength",
  "cardio",
  "balance",
  "mobility",
  "functional",
  "other",
];

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  created_by: number | null;
  is_default: boolean;
}

export interface LocationEquipment {
  id: number;
  name: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
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

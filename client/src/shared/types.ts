export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  isPublic: boolean;
  createdBy: number;
  createdAt: Date;
}

export interface WorkoutExercise {
  id?: number;
  exerciseId: number;
  name: string;
  category: string;
  primaryMuscle: string;
  sets: number;
  reps: number;
  weight: number | null;
  restSeconds: number | null;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  primaryMuscle: string;
}

export interface Workout {
  id: number;
  userId: number;
  locationId: number | null;
  name: string;
  description?: string;
  durationMinutes: number;
  intensity?: WorkoutIntensity;
  workoutType?: WorkoutType;
  muscleGroup?: MuscleGroup;
  createdAt: string;
  location?: {
    id: number;
    name: string;
  };
  exercises: WorkoutExercise[];
}

export interface WorkoutDraft {
  locationId: number;
  name: string;
  description: string;
  durationMinutes: string;
  intensity: WorkoutIntensity;
  workoutType: WorkoutType;
  muscleGroup: MuscleGroup;
  exercises: WorkoutExercise[];
}

export interface CreateWorkout {
  userId: number;
  locationId: number;
  name: string;
  description: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  workoutType: WorkoutType;
  muscleGroup: MuscleGroup;
  exercises: WorkoutExercise[];
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  durationMinutes?: number;
  locationId?: number;

  intensity?: WorkoutIntensity;
  workoutType?: WorkoutType;
  muscleGroup?: MuscleGroup;

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
  profilePictureUrl?: string;
  profileDescription?: string;
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
  isPublic: boolean;
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
  createdBy: number | null;
  isDefault: boolean;
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

export interface GenerateWorkoutSpecs {
  durationMinutes: number;
  intensity: WorkoutDraft["intensity"];
  workoutType: WorkoutDraft["workoutType"];
  muscleGroup: WorkoutDraft["muscleGroup"];
}

export type GenerateWorkoutInput = GenerateWorkoutSpecs & {
  locationId: number;
};

export interface GeneratedWorkout {
  name: string;
  description: string;
  durationMinutes: number;
  exercises: WorkoutExercise[];
}

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
  description: string;
  duration_minutes: number;
  created_at: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutDraft {
  location_id: number;
  name: string;
  description: string;
  duration_minutes: string;
  exercises: WorkoutExercise[];
}

export interface CreateWorkout {
  user_id: number;
  location_id: number;
  name: string;
  description: string;
  duration_minutes: number;
  exercises: WorkoutExercise[];
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  duration_minutes?: number;
  location_id?: number;
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

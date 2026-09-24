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

export interface Workout {
  id?: number;
  user_id: number;
  location_id: number;
  created_at?: Date;
}

export interface CreateWorkout {
  user_id: number;
  location_id: number;
  name: string;
  description?: string;
  duration_minutes?: number;
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

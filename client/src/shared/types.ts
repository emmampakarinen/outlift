export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  created_by: number;
  created_at: string;
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

export interface workoutNavigationState {
  backTo?: string;
  rootBackTo?: string;
  draft?: WorkoutDraft;
}

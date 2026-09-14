const API_URL = import.meta.env.VITE_API_URL;

export async function getWorkouts() {
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

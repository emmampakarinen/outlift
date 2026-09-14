const API_URL = import.meta.env.VITE_API_URL;

export async function getWorkouts() {
  const response = await fetch(`${API_URL}/workouts/1`);
  if (!response.ok) {
    throw new Error("Failed to fetch workouts");
  }
  return response.json();
}

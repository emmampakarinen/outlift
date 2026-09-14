const API_URL = import.meta.env.VITE_API_URL;

export async function getExercises() {
  const response = await fetch(`${API_URL}/exercises`);

  if (!response.ok) {
    throw new Error("Failed to fetch exercises");
  }

  return response.json();
}

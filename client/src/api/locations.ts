const API_URL = import.meta.env.VITE_API_URL;

type CreateLocationData = {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  created_by: number;
};

export async function getLocations() {
  const response = await fetch(`${API_URL}/locations`);
  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }
  return response.json();
}

export async function createLocation(location: CreateLocationData) {
  const response = await fetch(`${API_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });

  if (!response.ok) {
    throw new Error("Failed to create location");
  }

  return response.json();
}

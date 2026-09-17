import type { LoginResponse, LoginUser } from "../shared/types";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(user: LoginUser): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
}

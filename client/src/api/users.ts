import type { CreateUser, LoginResponse, LoginUser } from "../shared/types";

const API_URL = import.meta.env.VITE_API_URL;

interface RegisterResponse {
  message: string;
}

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

export async function registerUser(
  user: CreateUser,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }
  return response.json();
}

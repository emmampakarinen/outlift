import type { CreateLocationData, Location } from "../shared/types";
import { apiRequest } from "./apiRequest";

export function getLocations(token: string) {
  return apiRequest<Location[]>("/locations", { token });
}

export function createLocation(location: CreateLocationData, token: string) {
  return apiRequest<Location>("/locations", {
    method: "POST",
    token,
    body: JSON.stringify(location),
  });
}

export function getLocationById(id: number, token: string) {
  return apiRequest<Location>(`/locations/${id}`, { token });
}

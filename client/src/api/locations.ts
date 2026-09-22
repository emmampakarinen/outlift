import type {
  CreateLocationData,
  Location,
  LocationEquipment,
} from "../shared/types";
import { apiRequest } from "./apiRequest";

export function getLocations(token: string) {
  return apiRequest<Location[]>("/locations", { token });
}

export function createLocation(location: CreateLocationData, token: string) {
  return apiRequest<Location>("/locations", {
    method: "POST",
    token,
    body: location,
  });
}

export function getLocationById(id: number, token: string) {
  return apiRequest<Location>(`/locations/${id}`, { token });
}

export function getLocationEquipment(id: number, token: string) {
  return apiRequest<LocationEquipment[]>(`/locations/${id}/equipment`, {
    token,
  });
}

export function updateLocation(
  id: number,
  name: string,
  description: string,
  token: string,
) {
  return apiRequest<Location>(`/locations/${id}`, {
    token,
    method: "PATCH",
    body: { name: name, description: description },
  });
}

export function deleteLocation(id: number, token: string) {
  return apiRequest<void>(`/locations/${id}`, { token, method: "DELETE" });
}

import type { Equipment } from "../shared/types";
import { apiRequest } from "./apiRequest";

export function getEquipment(token: string) {
  return apiRequest<Equipment[]>("/equipment/", {
    token,
  });
}

export function createLocationEquipment(
  equipments: Equipment[],
  locationId: number,
  token: string,
) {
  return apiRequest<{ message: string }>("/equipment/", {
    token,
    method: "POST",
    body: {
      equipmentIds: equipments.map((equipment) => equipment.id),
      locationId,
    },
  });
}

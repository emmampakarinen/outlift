import type { LocationRow } from "#shared/types.js";

export function mapLocation(row: LocationRow) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    description: row.description,
    type: row.type,
    isPublic: row.is_public,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

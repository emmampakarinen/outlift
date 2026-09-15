import { useEffect, useState } from "react";
import { getLocations } from "../api/locations";
import { LocationListItem } from "../components/LocationListItem";
import type { Location } from "../shared/types";

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fbf9] px-5 py-7">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Locations</h1>

        <p className="mt-1 text-sm text-slate-500">
          {locations.length} outdoor training spots
        </p>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <LocationListItem location={location} />
        ))}
      </div>
    </main>
  );
}

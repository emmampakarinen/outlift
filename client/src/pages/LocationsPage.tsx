import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getLocations } from "../api/locations";
import { LocationListItem } from "../components/LocationListItem";
import type { Location } from "../shared/types";
import { C } from "../shared/colors";

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) =>
      location.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [locations, search]);

  return (
    <main className="min-h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-7 pb-4">
        <h1
          className="mb-4 text-2xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.5px",
          }}
        >
          Locations
        </h1>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.textFaint }}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search spots..."
            className="w-full rounded-2xl py-3 pr-4 pl-10 text-sm outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="flex flex-col gap-3">
          {filteredLocations.map((location) => (
            <LocationListItem key={location.id} location={location} />
          ))}
        </div>
      </div>
    </main>
  );
}

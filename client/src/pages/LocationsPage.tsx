import { useEffect, useMemo, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";

import { getLocations } from "../api/locations";
import { LocationListItem } from "../components/LocationListItem";
import type { Location } from "../shared/types";
import { C } from "../shared/colors";
import { useAuth } from "../contexts/useContext";
import { useAppNavigation } from "../shared/helpers";

type LocationFilter = "Nearby" | "My Locations" | "Community";

export function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LocationFilter>("Nearby");

  const { token, user } = useAuth();
  const { goTo } = useAppNavigation();

  useEffect(() => {
    if (!token) return;

    getLocations(token).then(setLocations);
  }, [token]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch = location.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const isOwner = location.createdBy === user?.id;

      const matchesFilter =
        filter === "Nearby" ||
        (filter === "My Locations" && isOwner) ||
        (filter === "Community" && !isOwner);

      return matchesSearch && matchesFilter;
    });
  }, [locations, search, filter, user?.id]);

  const filters: LocationFilter[] = ["Nearby", "My Locations", "Community"];

  return (
    <main className="flex h-full min-h-0 flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-7 pb-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{
              color: C.text,
              letterSpacing: "-0.5px",
            }}
          >
            Locations
          </h1>

          <button
            type="button"
            onClick={() => goTo("/locations/new")}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
            style={{
              background: C.forest,
              color: "white",
            }}
          >
            <Plus size={13} />
            Add Spot
          </button>
        </div>

        {/* Search */}
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

      {/* Filters */}
      {locations.length > 0 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto px-5 pb-4">
          {filters.map((item) => {
            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
                style={{
                  background: active ? C.forest : C.card,
                  color: active ? "white" : C.textMuted,
                  border: `1px solid ${active ? C.forest : C.border}`,
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      {/* Locations */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {locations.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: C.sageLight,
                color: C.forest,
              }}
            >
              <MapPin size={19} />
            </div>

            <h2 className="text-sm font-semibold" style={{ color: C.text }}>
              No training spots yet
            </h2>

            <p className="mt-1 text-xs" style={{ color: C.textMuted }}>
              Add your first training spot and start building workouts.
            </p>

            <button
              type="button"
              onClick={() => goTo("/locations/new")}
              className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold"
              style={{
                background: C.forest,
                color: "white",
              }}
            >
              Add Location
            </button>
          </div>
        ) : filteredLocations.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background: C.sageLight,
                color: C.forest,
              }}
            >
              <Search size={18} />
            </div>

            <h2 className="text-sm font-semibold" style={{ color: C.text }}>
              No training spots found
            </h2>

            <p className="mt-1 text-xs" style={{ color: C.textMuted }}>
              Try another search or discovery filter.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLocations.map((location) => (
              <LocationListItem
                key={location.id}
                location={location}
                isOwner={location.createdBy === user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

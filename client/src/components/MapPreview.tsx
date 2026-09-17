import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import type { Location } from "../shared/types";
import { C } from "../shared/colors";
import { AddLocationModal } from "./AddLocationModal";

type MapPreviewProps = {
  locations: Location[];
  onLocationsChange: () => Promise<void>;
};

export function MapPreview({ locations, onLocationsChange }: MapPreviewProps) {
  const [isAdding, setIsAdding] = useState(false);

  const center = {
    lat: 60.1699,
    lng: 24.9384,
  };

  return (
    <>
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          boxShadow: "0 2px 16px rgba(0, 0, 0, 0.07)",
        }}
      >
        <div className="relative h-64">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={center}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              className="h-full w-full"
              disableDefaultUI
            >
              {locations.map((location) => (
                <AdvancedMarker
                  key={location.id}
                  position={{
                    lat: Number(location.latitude),
                    lng: Number(location.longitude),
                  }}
                  title={location.name}
                />
              ))}
            </Map>
          </APIProvider>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
            style={{
              background: C.forest,
              color: "white",
            }}
            aria-label="Add training spot"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{
            background: C.card,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <MapPin size={14} fill={C.sage} stroke={C.sage} />

          <span className="text-xs font-medium" style={{ color: C.textMuted }}>
            {locations.length} training{" "}
            {locations.length === 1 ? "spot" : "spots"} nearby
          </span>
        </div>
      </div>

      {isAdding && (
        <AddLocationModal
          locations={locations}
          onClose={() => setIsAdding(false)}
          onCreated={onLocationsChange}
        />
      )}
    </>
  );
}

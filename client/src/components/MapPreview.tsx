import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { AddLocationModal } from "./AddLocationModal";
import type { Location } from "../shared/types";

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
      <div className="relative h-72 overflow-hidden rounded-3xl">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={center}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            className="h-full w-full"
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
          onClick={() => setIsAdding(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg"
        >
          + Add training spot
        </button>
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

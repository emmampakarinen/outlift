import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { createLocation } from "../api/locations";
import type { Location } from "../shared/types";
import { LocationForm } from "./LocationForm";
import { useAuth } from "../contexts/useContext";

type Position = {
  lat: number;
  lng: number;
};

type Props = {
  locations: Location[];
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function AddLocationModal({ locations, onClose, onCreated }: Props) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const center = {
    lat: 60.1699,
    lng: 24.9384,
  };

  async function handleSave() {
    if (!selectedPosition || !name.trim()) return;

    await createLocation(
      {
        name,
        description,
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
      },
      token,
    );

    await onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Add training spot
              </h2>

              <p className="text-sm text-slate-500">
                Tap the map to choose a location
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-slate-100 px-4 py-2 font-medium"
            >
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1">
            <Map
              defaultCenter={center}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              className="h-full w-full"
              onClick={(event) => {
                const position = event.detail.latLng;

                if (!position) return;

                setSelectedPosition({
                  lat: position.lat,
                  lng: position.lng,
                });
              }}
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

              {selectedPosition && (
                <AdvancedMarker
                  position={selectedPosition}
                  title="New training spot"
                />
              )}
            </Map>
          </div>

          <LocationForm
            name={name}
            description={description}
            disabled={!selectedPosition || !name.trim()}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onSave={handleSave}
          />
        </div>
      </APIProvider>
    </div>
  );
}

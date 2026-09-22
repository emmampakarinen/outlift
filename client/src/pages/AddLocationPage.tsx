import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { Map as MapIcon, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { createLocation } from "../api/locations";
import { createLocationEquipment, getEquipment } from "../api/equipment";
import { useAuth } from "../contexts/useContext";
import { C } from "../shared/colors";
import { useAppNavigation } from "../shared/helpers";
import type { Equipment } from "../shared/types";

import { BackButton } from "../components/BackButton";
import { ActionButton } from "../components/ActionButton";
import { InputField } from "../components/InputField";
import { EquipmentChips } from "../components/EquipmentChips";

type Position = {
  lat: number;
  lng: number;
};

type LocationMode = "map" | "address";

export function AddLocationPage() {
  const { goBack } = useAppNavigation();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [locationMode, setLocationMode] = useState<LocationMode>("map");

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );

  const [address, setAddress] = useState("");

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const [customInput, setCustomInput] = useState("");

  const center = {
    lat: 60.1699,
    lng: 24.9384,
  };

  useEffect(() => {
    if (!token) return;

    getEquipment(token).then(setEquipment);
  }, [token]);

  // location name and (TODO: address OR) pin on map need to be given to save the location
  const canSave = name.trim().length > 0 && selectedPosition !== null;

  function toggleEquipment(item: Equipment) {
    setSelectedEquipment((current) => {
      const alreadySelected = current.some(
        (equipment) => equipment.id === item.id,
      );

      if (alreadySelected) {
        return current.filter((equipment) => equipment.id !== item.id);
      }

      return [...current, item];
    });
  }

  async function handleSave() {
    if (!token || !selectedPosition || !name.trim()) return;

    const newLocation = await createLocation(
      {
        name: name.trim(),
        description: description.trim(),
        address: address,
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
      },
      token,
    );

    await createLocationEquipment(selectedEquipment, newLocation.id, token);

    goBack();
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background: C.bg,
        color: C.text,
      }}
    >
      <header
        className="sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3"
        style={{
          background: C.bg,
          borderColor: C.border,
        }}
      >
        <BackButton onNavigateBack={() => goBack()} />

        <h1 className="text-base font-semibold" style={{ color: C.text }}>
          New Location
        </h1>

        <ActionButton actionAllowed={canSave} handleAction={handleSave} />
      </header>

      <div className="mx-auto max-w-md px-5 py-5">
        <section className="mb-6">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Location Name
          </label>

          <InputField defaultValue={name} setInput={setName} />
        </section>

        <section className="mb-6">
          <label
            className="mb-3 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Location
          </label>

          <div
            className="mb-4 flex rounded-2xl p-1"
            style={{ background: C.muted }}
          >
            <button
              type="button"
              onClick={() => setLocationMode("map")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold"
              style={{
                background: locationMode === "map" ? C.card : "transparent",
                color: locationMode === "map" ? C.forest : C.textMuted,
              }}
            >
              <MapIcon size={14} />
              Drop Pin
            </button>

            <button
              type="button"
              onClick={() => setLocationMode("address")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold"
              style={{
                background: locationMode === "address" ? C.card : "transparent",
                color: locationMode === "address" ? C.forest : C.textMuted,
              }}
            >
              <MapPin size={14} />
              Address
            </button>
          </div>

          {locationMode === "map" ? (
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                height: 210,
                border: `2px solid ${selectedPosition ? C.forest : C.border}`,
              }}
            >
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultCenter={center}
                  defaultZoom={14}
                  mapId="DEMO_MAP_ID"
                  disableDefaultUI
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
                  {selectedPosition && (
                    <AdvancedMarker
                      position={selectedPosition}
                      title="New training spot"
                    />
                  )}
                </Map>
              </APIProvider>
            </div>
          ) : (
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: C.textFaint }}
              />

              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter address or place name"
                className="w-full rounded-2xl py-3 pr-4 pl-10 text-sm outline-none"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                }}
              />
            </div>
          )}
        </section>

        <section className="mb-6">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What makes this spot great for training?"
            className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </section>

        <section className="mb-8">
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Equipment
          </label>

          <p className="mb-3 text-xs" style={{ color: C.textFaint }}>
            Select equipment available at this spot
          </p>

          <EquipmentChips
            equipment={equipment}
            selectedEquipment={selectedEquipment}
            onToggle={toggleEquipment}
          />

          <div className="flex gap-2 mt-5">
            <input
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              placeholder="Add custom equipment..."
              className="min-w-0 flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                color: C.text,
              }}
            />

            <button
              type="button"
              disabled={!customInput.trim()}
              className="flex items-center gap-1 rounded-2xl px-4 py-2.5 text-sm font-semibold"
              style={{
                background: customInput.trim() ? C.forest : C.muted,
                color: customInput.trim() ? "white" : C.textFaint,
              }}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

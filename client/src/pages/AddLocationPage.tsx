import { APIProvider } from "@vis.gl/react-google-maps";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { createLocation } from "../api/locations";
import { createLocationEquipment, getEquipment } from "../api/equipment";
import { useAuth } from "../contexts/useContext";
import { C } from "../shared/colors";
import { useAppNavigation } from "../shared/helpers";
import type { Coordinates, Equipment } from "../shared/types";

import { BackButton } from "../components/BackButton";
import { ActionButton } from "../components/ActionButton";
import { InputField } from "../components/InputField";
import { EquipmentChips } from "../components/EquipmentChips";
import { AddressAutocomplete } from "../components/AddressAutoComplete";
import { LocationMap } from "../components/LocationMap";

export function AddLocationPage() {
  const { goBack } = useAppNavigation();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedPosition, setSelectedPosition] = useState<{
    position: Coordinates;
    address: string;
  } | null>(null);

  const [address, setAddress] = useState("");

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (!token) return;

    getEquipment(token).then(setEquipment);
  }, [token]);

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
        latitude: selectedPosition.position.lat,
        longitude: selectedPosition.position.lng,
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

        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <section className="mb-6">
            <label
              className="mb-3 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.textMuted }}
            >
              Location
            </label>

            {/* Address */}
            <AddressAutocomplete
              value={address}
              onChange={(value) => {
                setAddress(value);

                // If user starts editing the input,
                // old coordinates might not match the address anymore
                setSelectedPosition(null);
              }}
              onPlaceSelect={(place) => {
                setAddress(place.address);

                setSelectedPosition({
                  position: {
                    lat: place.lat,
                    lng: place.lng,
                  },
                  address: place.address,
                });
              }}
            />

            {/* OR divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: C.border }} />

              <span
                className="text-xs font-medium uppercase"
                style={{ color: C.textFaint }}
              >
                or
              </span>

              <div className="h-px flex-1" style={{ background: C.border }} />
            </div>

            {/* Map */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                height: 230,
                border: `2px solid ${selectedPosition ? C.forest : C.border}`,
              }}
            >
              <LocationMap
                selectedPosition={selectedPosition}
                onSelectPosition={(position, address) => {
                  setSelectedPosition({
                    position,
                    address,
                  });

                  setAddress(address);
                }}
              />
            </div>

            <p
              className="mt-2 text-center text-xs"
              style={{ color: C.textFaint }}
            >
              Search for an address or drop a pin on the map
            </p>
          </section>
        </APIProvider>

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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getLocationById,
  getLocationEquipment,
  updateLocation,
} from "../api/locations";
import { editLocationEquipment, getEquipment } from "../api/equipment";

import { useAuth } from "../contexts/useContext";
import { useAppNavigation } from "../shared/helpers";
import { C } from "../shared/colors";

import type { Equipment, Location, LocationEquipment } from "../shared/types";

import { BackButton } from "../components/BackButton";
import { ActionButton } from "../components/ActionButton";
import { InputField } from "../components/InputField";
import { EquipmentChips } from "../components/EquipmentChips";

export function EditLocationPage() {
  const { locationId } = useParams();
  const { token } = useAuth();
  const { goBack } = useAppNavigation();

  const [location, setLocation] = useState<Location | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (!locationId || !token) return;

    async function loadData() {
      const locationData = await getLocationById(Number(locationId), token);

      const allEquipment = await getEquipment(token);

      const currentEquipment = await getLocationEquipment(
        Number(locationId),
        token,
      );

      setLocation(locationData);

      setName(locationData.name);
      setDescription(locationData.description ?? "");

      setEquipment(allEquipment);

      setSelectedEquipment(
        allEquipment.filter((item) =>
          currentEquipment.some(
            (selected: LocationEquipment) => selected.id === item.id,
          ),
        ),
      );
    }

    loadData();
  }, [locationId, token]);

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
    if (!locationId || !token || !location) return;

    await updateLocation(
      Number(locationId),
      name.trim(),
      description.trim(),
      token,
    );

    await editLocationEquipment(selectedEquipment, Number(locationId), token);

    goBack();
  }

  if (!location) {
    return <main className="min-h-dvh" style={{ background: C.bg }} />;
  }

  const canSave = name.trim().length > 0;

  return (
    <main
      className="min-h-dvh"
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
          Edit Location
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
        </section>
      </div>
    </main>
  );
}

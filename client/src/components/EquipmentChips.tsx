import { Check } from "lucide-react";

import type { LocationEquipment } from "../shared/types";
import { C } from "../shared/colors";

type EquipmentChipsProps = {
  equipment: LocationEquipment[];
  selectedEquipment?: LocationEquipment[];
  onToggle?: (item: LocationEquipment) => void;
  selectable?: boolean;
};

export function EquipmentChips({
  equipment,
  selectedEquipment = [],
  onToggle,
  selectable = false,
}: EquipmentChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {equipment.map((item) => {
        const selected = selectedEquipment.some(
          (equipment) => equipment.id === item.id,
        );

        if (selectable) {
          return (
            <span
              key={item.id}
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: C.sageLight,
                color: C.forest,
              }}
            >
              {item.name}
            </span>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle?.(item)}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
            style={{
              background: selected ? C.sageLight : C.card,
              color: selected ? C.forest : C.textMuted,
              border: `1.5px solid ${selected ? C.forest : C.border}`,
            }}
          >
            {selected && <Check size={11} />}

            {item.name}
          </button>
        );
      })}
    </div>
  );
}

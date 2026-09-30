import { MapPin, X } from "lucide-react";

import { C } from "../shared/colors";
import type { Location } from "../shared/types";

type LocationPopupProps = {
  location: Location;
  onClose: () => void;
  onOpenLocation: () => void;
};

export function LocationPopup({
  location,
  onClose,
  onOpenLocation,
}: LocationPopupProps) {
  return (
    <div
      className="absolute bottom-12 left-1/2 z-20 w-64 -translate-x-1/2 rounded-2xl p-3 shadow-lg"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: C.forest }}
          >
            {location.name}
          </p>

          {location.description && (
            <p className="mt-1 text-xs leading-4 text-gray-500">
              {location.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
          aria-label="Close location popup"
        >
          <X size={16} />
        </button>
      </div>

      {location.address && (
        <div className="mt-3 flex items-start gap-2">
          <MapPin
            size={14}
            className="mt-0.5 shrink-0"
            style={{ color: C.forest }}
          />

          <p className="text-xs leading-4 text-gray-600">{location.address}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onOpenLocation}
        className="mt-3 w-full rounded-xl px-3 py-2 text-xs font-medium text-white"
        style={{
          background: C.forest,
        }}
      >
        View location
      </button>

      <div
        className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45"
        style={{
          background: C.card,
          borderRight: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      />
    </div>
  );
}

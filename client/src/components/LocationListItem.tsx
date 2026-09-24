import { ChevronRight, MapPin } from "lucide-react";
import type { Location } from "../shared/types";
import { useAppNavigation } from "../shared/helpers";
import { C } from "../shared/colors";

type Props = {
  location: Location;
};

export function LocationListItem({ location }: Props) {
  const { goTo } = useAppNavigation();

  return (
    <button
      type="button"
      onClick={() => goTo(`/locations/${location.id}`)}
      className="w-full overflow-hidden rounded-2xl text-left transition hover:-translate-y-0.5"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="flex h-36 items-center justify-center"
        style={{
          background: C.sageLight,
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: C.sagePale,
            color: C.forest,
          }}
        >
          <MapPin size={26} fill={C.forest} />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2
              className="truncate text-sm font-semibold"
              style={{ color: C.text }}
            >
              {location.name}
            </h2>

            <div className="mt-1 flex items-start gap-1.5">
              <MapPin
                size={11}
                className="mt-0.5 shrink-0"
                style={{ color: C.textFaint }}
              />

              <p
                className="line-clamp-2 text-xs"
                style={{ color: C.textMuted }}
              >
                {location.address || "No address"}
              </p>
            </div>
          </div>

          <ChevronRight size={16} style={{ color: C.textFaint }} />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: C.sage }}
          />

          <span className="text-xs" style={{ color: C.textMuted }}>
            {location.description || "Outdoor training spot"}
          </span>
        </div>
      </div>
    </button>
  );
}

import { MapPin } from "lucide-react";
import { C } from "../shared/colors";
import { useAppNavigation } from "../shared/helpers";

type NearbySpotCardProps = {
  id: number;
  name: string;
  description?: string;
};

export function NearbySpotCard({ id, name, description }: NearbySpotCardProps) {
  const { goTo } = useAppNavigation();

  return (
    <button
      type="button"
      onClick={() => goTo(`/locations/${id}`)}
      className="w-44 shrink-0 overflow-hidden rounded-2xl text-left transition hover:-translate-y-0.5"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        className="flex h-24 items-center justify-center"
        style={{
          background: C.sageLight,
        }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: C.sagePale,
            color: C.forest,
          }}
        >
          <MapPin size={21} fill={C.forest} />
        </div>
      </div>

      <div className="p-3">
        <h3
          className="mb-1 truncate text-sm font-semibold"
          style={{ color: C.text }}
        >
          {name}
        </h3>

        <p
          className="line-clamp-2 text-xs leading-relaxed"
          style={{ color: C.textMuted }}
        >
          {description || "Outdoor training spot"}
        </p>
      </div>
    </button>
  );
}

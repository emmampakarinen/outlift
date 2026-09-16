import { ChevronRight, Dumbbell, MapPin } from "lucide-react";
import type { Location } from "../shared/types";
import { useAppNavigation } from "../shared/helpers";

type Props = {
  location: Location;
};

export function LocationListItem({ location }: Props) {
  const { goTo } = useAppNavigation();

  return (
    <button
      onClick={() => goTo(`/locations/${location.id}`)}
      key={location.id}
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-emerald-50"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#1a4332]">
        <MapPin size={28} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-slate-900">
          {location.name}
        </h2>

        <p className="mt-1 truncate text-sm text-slate-500">
          address placeholder
        </p>

        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Dumbbell size={14} />
            number of equipment placeholder
          </span>

          <span>type placeholder</span>
        </div>
      </div>

      <ChevronRight size={20} className="shrink-0 text-slate-300" />
    </button>
  );
}

import { Clock, Dumbbell } from "lucide-react";
import type { Workout } from "../shared/types";
import { C } from "../shared/colors";
import { useAppNavigation } from "../shared/helpers";

type Props = {
  workout: Workout;
  locationName?: string;
};

export function WorkoutCard({ workout, locationName }: Props) {
  const { goTo } = useAppNavigation();

  return (
    <button
      type="button"
      onClick={() => goTo(`/workouts/${workout.id}`)}
      className="flex w-full items-center gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: C.sageLight,
          color: C.forest,
        }}
      >
        <Dumbbell size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-sm font-semibold"
          style={{ color: C.text }}
        >
          {workout.name}
        </h3>

        <p className="mt-0.5 truncate text-xs" style={{ color: C.textMuted }}>
          {locationName || "Unknown location"}
        </p>
      </div>

      <div
        className="flex shrink-0 items-center gap-1"
        style={{ color: C.textFaint }}
      >
        <Clock size={12} />

        <span className="text-xs font-medium">{workout.duration_minutes}m</span>
      </div>
    </button>
  );
}

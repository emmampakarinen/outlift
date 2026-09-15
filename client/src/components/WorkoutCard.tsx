import { ChevronRight, Dumbbell } from "lucide-react";
import type { Workout } from "../shared/types";
import { useNavigate } from "react-router-dom";

type Props = {
  workout: Workout;
};

export function WorkoutCard({ workout }: Props) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/workouts/${workout.id}`)}
      className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#1a4332]">
        <Dumbbell size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-slate-900">
          {workout.name}
        </h2>

        <p className="mt-1 truncate text-sm text-slate-500">
          {workout.description || "No description"}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {workout.duration_minutes} min
        </p>
      </div>

      <ChevronRight size={20} className="shrink-0 text-slate-300" />
    </button>
  );
}

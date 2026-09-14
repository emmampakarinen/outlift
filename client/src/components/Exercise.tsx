import { Plus } from "lucide-react";
import type { Exercise } from "../shared/types";

type Props = {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
};

export function Exercise({ exercise, onAdd }: Props) {
  return (
    <article
      key={exercise.id}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="min-w-0">
        <h2 className="font-bold text-slate-900">{exercise.name}</h2>

        <p className="mt-1 text-sm text-slate-500">{exercise.primary_muscle}</p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            exercise.category === "Upper Body"
              ? "bg-blue-100 text-blue-600"
              : exercise.category === "Core"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {exercise.category}
        </span>

        <button
          onClick={() => onAdd(exercise)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a4332] text-white transition hover:opacity-90"
        >
          <Plus size={20} />
        </button>
      </div>
    </article>
  );
}

export default Exercise;

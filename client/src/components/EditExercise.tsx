import { Trash2Icon } from "lucide-react";
import type { WorkoutExercise } from "../shared/types";

type Props = {
  exercise: WorkoutExercise;
  onChange: (id: number, type: string, value: number) => void;
  onDelete: (id: number) => void;
};

export function EditExercise({ exercise, onChange, onDelete }: Props) {
  return (
    <div
      key={`${exercise.exercise_id}-${exercise.id}`}
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="grid grid-cols-[1fr_auto] items-start">
        <div>
          <h3 className="font-semibold text-slate-900">{exercise.name}</h3>

          <p className="mt-1 text-sm text-slate-500">{exercise.category}</p>
        </div>

        <button
          onClick={() => onDelete(exercise.exercise_id)}
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
        >
          <Trash2Icon size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            Sets
          </label>

          <input
            type="number"
            min="1"
            value={exercise.sets}
            onChange={(e) =>
              onChange(exercise.exercise_id, "sets", Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            Reps
          </label>

          <input
            type="number"
            min="0"
            value={exercise.reps}
            onChange={(e) =>
              onChange(exercise.exercise_id, "reps", Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-400">
            Weight (kg)
          </label>

          <input
            type="number"
            min="0"
            value={exercise.weight ?? 0}
            onChange={(e) =>
              onChange(exercise.exercise_id, "weight", Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-300"
          />
        </div>
      </div>
    </div>
  );
}

import { Trash2 } from "lucide-react";
import type { WorkoutExercise } from "../shared/types";
import { C } from "../shared/colors";

type Props = {
  exercise: WorkoutExercise;
  onChange: (
    id: number,
    type: "sets" | "reps" | "weight",
    value: number,
  ) => void;
  onDelete: (id: number) => void;
};

export function EditExercise({ exercise, onChange, onDelete }: Props) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Exercise header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{
          borderBottom: `1px solid ${C.muted}`,
        }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>
            {exercise.name}
          </h3>

          <p
            className="mt-0.5 text-xs font-medium"
            style={{ color: C.forestMid }}
          >
            {exercise.category}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(exercise.exercise_id)}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: "#FEF2F2",
            color: "#EF4444",
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Values */}
      <div className="px-4 py-3">
        <div className="mb-2 grid grid-cols-3 gap-2">
          <span className="text-xs font-medium" style={{ color: C.textFaint }}>
            Sets
          </span>

          <span className="text-xs font-medium" style={{ color: C.textFaint }}>
            Reps
          </span>

          <span className="text-xs font-medium" style={{ color: C.textFaint }}>
            Weight (kg)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ExerciseNumberInput
            value={exercise.sets}
            min={1}
            onChange={(value) => onChange(exercise.exercise_id, "sets", value)}
          />

          <ExerciseNumberInput
            value={exercise.reps}
            min={0}
            onChange={(value) => onChange(exercise.exercise_id, "reps", value)}
          />

          <ExerciseNumberInput
            value={exercise.weight ?? 0}
            min={0}
            onChange={(value) =>
              onChange(exercise.exercise_id, "weight", value)
            }
          />
        </div>
      </div>
    </div>
  );
}

function ExerciseNumberInput({
  value,
  min,
  onChange,
}: {
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-9 w-full rounded-lg px-2 text-center text-sm font-medium outline-none"
      style={{
        background: C.bg,
        border: `1px solid ${C.border}`,
        color: C.text,
      }}
    />
  );
}

import { Check, Plus } from "lucide-react";
import type { Exercise } from "../shared/types";
import { C, CATEGORY_COLORS } from "../shared/colors";

type Props = {
  exercise: Exercise;
  onAdd?: (exercise: Exercise) => void;
  isAdded?: boolean;
};

export function ExerciseListItem({ exercise, onAdd, isAdded = false }: Props) {
  const categoryColors = CATEGORY_COLORS[exercise.category] ?? {
    background: C.muted,
    text: C.textSub,
  };

  return (
    <article
      className="flex items-center gap-3 rounded-xl p-3.5"
      style={{
        background: C.card,
        border: `1px solid ${isAdded ? C.sagePale : C.border}`,
        opacity: isAdded ? 0.65 : 1,
      }}
    >
      <div className="min-w-0 flex-1">
        <h2
          className="truncate text-sm font-semibold"
          style={{ color: C.text }}
        >
          {exercise.name}
        </h2>

        <p className="mt-0.5 truncate text-xs" style={{ color: C.textMuted }}>
          {exercise.primary_muscle}
        </p>
      </div>

      <span
        className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{
          background: categoryColors.background,
          color: categoryColors.text,
        }}
      >
        {exercise.category}
      </span>

      {onAdd && (
        <button
          type="button"
          disabled={isAdded}
          onClick={() => !isAdded && onAdd(exercise)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{
            background: isAdded ? C.sageLight : C.forest,
            color: isAdded ? C.sage : "white",
          }}
        >
          {isAdded ? (
            <Check size={13} strokeWidth={3} />
          ) : (
            <Plus size={13} strokeWidth={2.5} />
          )}
        </button>
      )}
    </article>
  );
}

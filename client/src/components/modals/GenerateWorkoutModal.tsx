import { X } from "lucide-react";

import {
  MUSCLE_GROUPS,
  WORKOUT_TYPES,
  type GenerateWorkoutSpecs,
  type WorkoutDraft,
} from "../../shared/types";
import { C } from "../../shared/colors";
import { FormField } from "../FormField";
import { formatLabel } from "../../shared/helpers";
import { IntensitySelector } from "../IntensitySelector";

type GenerateWorkoutModalProps = {
  specs: GenerateWorkoutSpecs;
  onChange: (specs: GenerateWorkoutSpecs) => void;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating?: boolean;
};

export function GenerateWorkoutModal({
  specs,
  onChange,
  onClose,
  onGenerate,
  isGenerating = false,
}: GenerateWorkoutModalProps) {
  const canGenerate = Number(specs.durationMinutes) > 0 && !isGenerating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-5 sm:items-center"
      style={{
        background: "rgba(20, 35, 28, 0.35)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[28px] p-5 shadow-xl"
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-xl font-bold"
              style={{
                color: C.text,
                letterSpacing: "-0.3px",
              }}
            >
              Generate Workout
            </h2>

            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: C.textMuted }}
            >
              Choose your preferences and we'll build a workout for you.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.textSub,
            }}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Duration */}
        <div className="mb-5">
          <FormField
            label="Duration (minutes)"
            type="number"
            min={1}
            value={specs.durationMinutes}
            onChange={(value) =>
              onChange({
                ...specs,
                durationMinutes: Number(value),
              })
            }
          />
        </div>

        {/* Intensity */}
        <div className="mb-5">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Intensity
          </label>

          <IntensitySelector
            value={specs.intensity}
            onChange={(intensity) =>
              onChange({
                ...specs,
                intensity,
              })
            }
          />
        </div>

        {/* Workout type */}
        <div className="mb-4">
          <FormField
            label="Workout Type"
            type="select"
            value={specs.workoutType}
            options={WORKOUT_TYPES.map((type) => ({
              value: type,
              label: formatLabel(type),
            }))}
            onChange={(value) =>
              onChange({
                ...specs,
                workoutType: value as WorkoutDraft["workoutType"],
              })
            }
          />
        </div>

        {/* Muscle group */}
        <div className="mb-6">
          <FormField
            label="Muscle Group"
            type="select"
            value={specs.muscleGroup}
            options={MUSCLE_GROUPS.map((group) => ({
              value: group,
              label: formatLabel(group),
            }))}
            onChange={(value) =>
              onChange({
                ...specs,
                muscleGroup: value as WorkoutDraft["muscleGroup"],
              })
            }
          />
        </div>

        {/* Generate */}
        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className="w-full rounded-2xl py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: C.forest,
            color: "white",
          }}
        >
          {isGenerating ? "Generating..." : "Generate Workout"}
        </button>
      </div>
    </div>
  );
}

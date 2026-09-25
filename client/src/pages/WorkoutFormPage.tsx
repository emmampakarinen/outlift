import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

import { createWorkout, editWorkout, getWorkoutById } from "../api/workouts";

import type {
  Workout,
  CreateWorkout,
  UpdateWorkout,
  WorkoutDraft,
} from "../shared/types";

import {
  WORKOUT_INTENSITIES,
  WORKOUT_TYPES,
  MUSCLE_GROUPS,
} from "../shared/types";

import { EditExercise } from "../components/EditExercise";
import { useAppNavigation } from "../shared/helpers";
import { C, INTENSITY_COLORS } from "../shared/colors";
import { useAuth } from "../contexts/useContext";
import { BackButton } from "../components/BackButton";
import { FormField } from "../components/FormField";

export function WorkoutFormPage() {
  const { locationId, workoutId } = useParams();
  const location = useLocation();
  const { goTo, goBack } = useAppNavigation();
  const { token } = useAuth();

  const isCreateMode = !workoutId;

  const [workout, setWorkout] = useState<Workout | null>(null);

  const [draft, setDraft] = useState<WorkoutDraft>(() => ({
    name: location.state?.draft?.name ?? "",
    duration_minutes: location.state?.draft?.duration_minutes ?? "",
    description: location.state?.draft?.description ?? "",

    intensity: location.state?.draft?.intensity ?? "moderate",
    workout_type: location.state?.draft?.workout_type ?? "strength",
    muscle_group: location.state?.draft?.muscle_group ?? "full-body",

    exercises: location.state?.draft?.exercises ?? [],
    location_id: Number(locationId),
  }));

  useEffect(() => {
    if (isCreateMode) return;

    getWorkoutById(Number(workoutId), token).then((data) => {
      setWorkout(data);

      if (!location.state?.draft) {
        setDraft({
          name: data.name,
          duration_minutes: String(data.duration_minutes),
          description: data.description ?? "",

          intensity: data.intensity,
          workout_type: data.workout_type,
          muscle_group: data.muscle_group,

          exercises: data.exercises,
          location_id: data.location_id,
        });
      }
    });
  }, [workoutId, isCreateMode, location.state?.draft, token]);

  if (!isCreateMode && !workout) {
    return <main className="min-h-dvh" style={{ background: C.bg }} />;
  }

  async function handleWorkoutSave() {
    if (isCreateMode) {
      const newWorkout: CreateWorkout = {
        user_id: 1,
        location_id: draft.location_id,
        name: draft.name,
        description: draft.description,
        duration_minutes: Number(draft.duration_minutes),

        intensity: draft.intensity,
        workout_type: draft.workout_type,
        muscle_group: draft.muscle_group,

        exercises: draft.exercises,
      };

      await createWorkout(newWorkout, token);

      goBack();
      return;
    }

    if (!workout) return;

    const updatedWorkout: UpdateWorkout = {
      name: draft.name,
      description: draft.description,
      duration_minutes: Number(draft.duration_minutes),
      location_id: draft.location_id ?? undefined,

      intensity: draft.intensity,
      workout_type: draft.workout_type,
      muscle_group: draft.muscle_group,

      exercises: draft.exercises,
    };

    await editWorkout(updatedWorkout, workout.id, token);

    goBack();
  }

  function handleExerciseChange(
    exerciseId: number,
    field: "sets" | "reps" | "weight",
    value: number,
  ) {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.exercise_id === exerciseId
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise,
      ),
    }));
  }

  function handleExerciseDelete(exerciseId: number) {
    setDraft((current) => ({
      ...current,
      exercises: current.exercises.filter(
        (exercise) => exercise.exercise_id !== exerciseId,
      ),
    }));
  }

  function handleAddExercise() {
    if (isCreateMode) {
      goTo("/workouts/new/exercises", { draft });
      return;
    }

    goTo(`/workouts/${workoutId}/edit/exercises`, { draft });
  }

  function formatLabel(value: string) {
    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <main className="min-h-dvh" style={{ background: C.bg }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 pt-5 pb-3"
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: C.bg,
        }}
      >
        <BackButton onNavigateBack={() => goBack()} />

        <h1 className="text-base font-semibold" style={{ color: C.text }}>
          {isCreateMode ? "New Workout" : "Edit Workout"}
        </h1>

        <button
          type="button"
          onClick={handleWorkoutSave}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: C.forest,
            color: "white",
          }}
        >
          Save
        </button>
      </header>

      <div className="px-5 py-5">
        {/* Workout name */}
        <FormField
          label="Workout Name"
          value={draft.name}
          placeholder="Name your workout"
          onChange={(value) =>
            setDraft((current) => ({
              ...current,
              name: value,
            }))
          }
        />

        {/* Duration */}
        <div className="mb-4">
          <FormField
            label="Duration (minutes)"
            type="number"
            min={1}
            value={draft.duration_minutes}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                duration_minutes: value,
              }))
            }
          />
        </div>

        <div className="mb-5">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Intensity
          </label>

          <div className="flex gap-2">
            {WORKOUT_INTENSITIES.map((intensity) => {
              const selected = draft.intensity === intensity;
              const colors = INTENSITY_COLORS[intensity];

              return (
                <button
                  key={intensity}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      intensity,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-2xl px-1.5 py-3 text-xs font-semibold transition sm:text-sm"
                  style={{
                    background: selected ? colors.background : C.card,
                    border: `1px solid ${selected ? colors.border : C.border}`,
                    color: selected ? colors.text : C.textSub,
                    boxShadow: selected ? `0 0 0 1px ${colors.border}` : "none",
                  }}
                >
                  {formatLabel(intensity)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <FormField
            label="Workout Type"
            type="select"
            value={draft.workout_type}
            options={WORKOUT_TYPES.map((type) => ({
              value: type,
              label: formatLabel(type),
            }))}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                workout_type: value as WorkoutDraft["workout_type"],
              }))
            }
          />
        </div>

        <div className="mb-5">
          <FormField
            label="Muscle Group"
            type="select"
            value={draft.muscle_group}
            options={MUSCLE_GROUPS.map((group) => ({
              value: group,
              label: formatLabel(group),
            }))}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                muscle_group: value as WorkoutDraft["muscle_group"],
              }))
            }
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            className="mb-2 block text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Description
          </label>

          <textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Describe your workout"
            rows={2}
            className="w-full resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </div>

        {/* Exercises header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: C.text }}>
            Exercises
          </h2>

          <span className="text-xs" style={{ color: C.textFaint }}>
            {draft.exercises.length} total
          </span>
        </div>

        {/* Exercises */}
        <div className="flex flex-col gap-3">
          {draft.exercises.map((exercise) => (
            <EditExercise
              key={exercise.exercise_id}
              exercise={exercise}
              onChange={handleExerciseChange}
              onDelete={handleExerciseDelete}
            />
          ))}
        </div>

        {/* Add exercise */}
        <button
          type="button"
          onClick={handleAddExercise}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-sm font-semibold"
          style={{
            background: C.card,
            borderColor: C.sagePale,
            color: C.forest,
          }}
        >
          <Plus size={16} />
          Add Exercise
        </button>
      </div>
    </main>
  );
}

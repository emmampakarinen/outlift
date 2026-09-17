import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Dumbbell,
  Layers3,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import { deleteWorkout, getWorkoutById } from "../api/workouts";
import type { Workout } from "../shared/types";
import { useAppNavigation } from "../shared/helpers";
import { C, CATEGORY_COLORS } from "../shared/colors";

export function WorkoutPage() {
  const { workoutId } = useParams();
  const { goTo, goBack } = useAppNavigation();

  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!workoutId) return;

    getWorkoutById(Number(workoutId)).then(setWorkout);
  }, [workoutId]);

  if (!workout) {
    return (
      <main className="min-h-screen px-5 pt-7" style={{ background: C.bg }}>
        <p className="text-sm" style={{ color: C.textMuted }}>
          Loading workout...
        </p>
      </main>
    );
  }

  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets,
    0,
  );

  async function handleDeleteWorkout() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`,
    );

    if (!confirmed) return;

    await deleteWorkout(workout.id);
    goBack();
  }

  return (
    <main className="min-h-screen px-5 pt-7 pb-8" style={{ background: C.bg }}>
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goBack()}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(`/workouts/${workout.id}/edit`)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.forest,
            }}
          >
            <Pencil size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDeleteWorkout}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              background: "#FEF2F2",
              color: "#EF4444",
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      {/* Workout info */}
      <section className="mt-6">
        <h1
          className="mb-1 text-2xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.5px",
          }}
        >
          {workout.name}
        </h1>

        <div className="flex flex-wrap items-center gap-1.5">
          <MapPin size={12} style={{ color: C.textFaint }} />

          <span className="text-sm" style={{ color: C.textMuted }}>
            {workout.location_id
              ? `Location #${workout.location_id}`
              : "No location"}
          </span>

          <span style={{ color: "#D1D5DB" }}>·</span>

          <span className="text-sm" style={{ color: C.textMuted }}>
            {new Date(workout.created_at).toLocaleDateString()}
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <StatCard
          label="Duration"
          value={`${workout.duration_minutes}m`}
          icon={<Clock3 size={16} />}
        />

        <StatCard
          label="Exercises"
          value={workout.exercises.length}
          icon={<Dumbbell size={16} />}
        />

        <StatCard
          label="Total Sets"
          value={totalSets}
          icon={<Layers3 size={16} />}
        />
      </section>

      {/* Description */}
      {workout.description && (
        <section
          className="mt-6 rounded-2xl p-4"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: C.textSub }}>
            {workout.description}
          </p>
        </section>
      )}

      {/* Exercises */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>
          Exercises
        </h2>

        <div className="flex flex-col gap-3">
          {workout.exercises.map((exercise) => {
            const categoryColors = CATEGORY_COLORS[exercise.category] ?? {
              background: C.muted,
              text: C.textSub,
            };

            return (
              <article
                key={exercise.id}
                className="rounded-2xl p-4"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Exercise header */}
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    {exercise.name}
                  </h3>

                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: categoryColors.background,
                      color: categoryColors.text,
                    }}
                  >
                    {exercise.category}
                  </span>
                </div>

                {/* Exercise stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <ExerciseValue label="Sets" value={exercise.sets} />

                  <ExerciseValue label="Reps" value={exercise.reps} />

                  <ExerciseValue
                    label="Weight"
                    value={
                      exercise.weight !== null ? `${exercise.weight} kg` : "–"
                    }
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-3.5 text-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      <div className="mb-1 flex justify-center" style={{ color: C.sage }}>
        {icon}
      </div>

      <p className="text-lg font-bold" style={{ color: C.text }}>
        {value}
      </p>

      <p className="text-xs" style={{ color: C.textMuted }}>
        {label}
      </p>
    </div>
  );
}

function ExerciseValue({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs font-medium" style={{ color: C.textFaint }}>
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold" style={{ color: C.text }}>
        {value}
      </p>
    </div>
  );
}

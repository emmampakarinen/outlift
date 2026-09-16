import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  Dumbbell,
  Layers3,
  MapPin,
  PenBoxIcon,
} from "lucide-react";
import { getWorkoutById } from "../api/workouts";
import type { Workout } from "../shared/types";
import { useAppNavigation } from "../shared/helpers";

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
      <main className="px-5 pt-7">
        <p className="text-slate-500">Loading workout...</p>
      </main>
    );
  }

  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets,
    0,
  );

  return (
    <main className="min-h-screen bg-white px-5 pt-7 pb-8">
      <header className="flex items-center justify-between">
        <button
          onClick={() => goBack()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4332] shadow-md"
        >
          <ArrowLeft size={24} strokeWidth={2.2} />
        </button>

        <button
          onClick={() => goTo(`/workouts/${workout.id}/edit`)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1a4332] shadow-sm transition hover:bg-slate-50"
        >
          <PenBoxIcon size={17} strokeWidth={2} />
          Edit
        </button>
      </header>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-slate-900">{workout.name}</h2>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} />
          <span>Location #{workout.location_id ?? "-"}</span>
          <span>·</span>
          <span>{new Date(workout.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm">
          <Clock3 className="mx-auto text-emerald-400" size={24} />
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {workout.duration_minutes}m
          </p>
          <p className="mt-1 text-sm text-slate-500">Duration</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm">
          <Dumbbell className="mx-auto text-emerald-400" size={24} />
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {workout.exercises.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Exercises</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm">
          <Layers3 className="mx-auto text-emerald-400" size={24} />
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalSets}</p>
          <p className="mt-1 text-sm text-slate-500">Total Sets</p>
        </div>
      </section>

      {workout.description && (
        <p className="mt-8 text-slate-600">{workout.description}</p>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Exercises</h2>

        <div className="mt-4 space-y-4">
          {workout.exercises.map((exercise) => (
            <article
              key={exercise.id}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {exercise.name}
                  </h3>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#1a4332]">
                  {exercise.category}
                </span>
              </div>

              <div className="mt-5 flex gap-8">
                <div>
                  <p className="text-xs font-medium text-slate-400">Sets</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {exercise.sets}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">Reps</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {exercise.reps}
                  </p>
                </div>

                {exercise.weight !== null && (
                  <div>
                    <p className="text-xs font-medium text-slate-400">Weight</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {exercise.weight} kg
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

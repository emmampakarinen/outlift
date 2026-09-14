import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkoutById } from "../api/workouts";
import type { Workout } from "../shared/types";

export function EditWorkoutPage() {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!workoutId) return;

    getWorkoutById(Number(workoutId)).then((data) => {
      setWorkout(data);
      setName(data.name);
      setDuration(String(data.duration_minutes));
      setDescription(data.description ?? "");
    });
  }, [workoutId]);

  if (!workout) {
    return <main className="p-5">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f8fbf9]">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4332] shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-bold text-slate-900">Edit Workout</h1>

        <button className="rounded-full bg-[#1a4332] px-5 py-3 text-sm font-semibold text-white">
          Save
        </button>
      </header>

      <div className="space-y-7 px-5 py-7">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Workout name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Duration (minutes)
          </label>

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Notes
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How did the session go?"
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Exercises</h2>

            <span className="text-sm text-slate-400">
              {workout.exercises.length} total
            </span>
          </div>

          <div className="space-y-3">
            {workout.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {exercise.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {exercise.sets} sets · {exercise.reps} reps
                    </p>
                  </div>

                  {exercise.weight !== null && (
                    <span className="text-sm font-medium text-slate-500">
                      {exercise.weight} kg
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/workouts/${workoutId}/edit/exercises`)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200 bg-white py-5 font-semibold text-[#1a4332] transition hover:bg-emerald-50"
          >
            <Plus size={20} />
            Add Exercise
          </button>
        </section>
      </div>
    </main>
  );
}

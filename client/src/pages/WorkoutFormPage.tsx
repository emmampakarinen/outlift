import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { createWorkout, editWorkout, getWorkoutById } from "../api/workouts";
import type {
  Workout,
  CreateWorkout,
  UpdateWorkout,
  WorkoutDraft,
} from "../shared/types";
import { EditExercise } from "../components/EditExercise";
import { useAppNavigation } from "../shared/helpers";

export function WorkoutFormPage() {
  const { locationId, workoutId } = useParams();
  const location = useLocation();
  const { goTo, goBack } = useAppNavigation();

  const isCreateMode = !workoutId;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [draft, setDraft] = useState<WorkoutDraft>(() => ({
    name: location.state?.draft?.name ?? "",
    duration_minutes: location.state?.draft?.duration_minutes ?? "",
    description: location.state?.draft?.description ?? "",
    exercises: location.state?.draft?.exercises ?? [],
    location_id: Number(locationId),
  }));

  useEffect(() => {
    // when creating a new workout, there's no existing workout to fetch
    if (isCreateMode) {
      return;
    }

    getWorkoutById(Number(workoutId)).then((data) => {
      setWorkout(data);
      if (!location.state?.draft) {
        setDraft({
          name: data.name,
          duration_minutes: String(data.duration_minutes),
          description: data.description ?? "",
          exercises: data.exercises,
          location_id: data.location_id,
        });
      }
    });
  }, [workoutId, isCreateMode, location.state?.draft]);

  // only showing loading when editing an existing workout
  if (!isCreateMode && !workout) {
    return <main className="p-5">Loading...</main>;
  }

  async function handleWorkoutSave() {
    if (isCreateMode) {
      const newWorkout: CreateWorkout = {
        user_id: 1,
        location_id: draft.location_id,
        name: draft.name,
        description: draft.description,
        duration_minutes: Number(draft.duration_minutes),
        exercises: draft.exercises,
      };

      await createWorkout(newWorkout);

      goBack();
      return;
    }

    if (!workout) return;

    const updatedWorkout: UpdateWorkout = {
      name: draft.name,
      description: draft.description,
      duration_minutes: Number(draft.duration_minutes),
      location_id: draft.location_id ?? undefined,
      exercises: draft.exercises,
    };

    await editWorkout(updatedWorkout, workout.id);

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

  return (
    <main className="min-h-screen bg-[#f8fbf9]">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-6">
        <button
          onClick={() => goBack()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4332] shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-bold text-slate-900">
          {isCreateMode ? "New Workout" : "Edit Workout"}
        </h1>

        <button
          onClick={handleWorkoutSave}
          className="rounded-full bg-[#1a4332] px-5 py-3 text-sm font-semibold text-white"
        >
          Save
        </button>
      </header>

      <div className="space-y-7 px-5 py-7">
        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Workout name
          </label>

          <input
            value={draft.name}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                name: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Duration (minutes)
          </label>

          <input
            type="number"
            value={draft.duration_minutes}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                duration_minutes: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-semibold text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-500">
            Notes
          </label>

          <textarea
            value={draft.description}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
            placeholder="How did the session go?"
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none focus:border-emerald-300"
          />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Exercises</h2>

            <span className="text-sm text-slate-400">
              {draft.exercises.length} total
            </span>
          </div>

          <div className="space-y-3">
            {draft.exercises.map((exercise) => (
              <EditExercise
                key={exercise.exercise_id}
                exercise={exercise}
                onChange={handleExerciseChange}
                onDelete={handleExerciseDelete}
              />
            ))}
          </div>

          <button
            onClick={handleAddExercise}
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

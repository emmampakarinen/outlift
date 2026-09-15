import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getExercises } from "../api/exercises";
import { getWorkouts } from "../api/workouts";
import { ExerciseListItem } from "../components/ExerciseListItem";
import { WorkoutCard } from "../components/WorkoutCard";
import type { Exercise, Workout } from "../shared/types";

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"workouts" | "exercises">(
    "workouts",
  );

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getExercises().then(setExercises);
    getWorkouts().then(setWorkouts);
  }, []);

  const categories = useMemo(() => {
    const exerciseCategories = exercises.map((exercise) => exercise.category);

    const uniqueCategories = Array.from(new Set(exerciseCategories));

    return ["All", ...uniqueCategories];
  }, [exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || exercise.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [exercises, search, selectedCategory]);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) =>
      workout.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [workouts, search]);

  function handleTabChange(tab: "exercises" | "workouts") {
    setActiveTab(tab);
    setSearch("");
    setSelectedCategory("All");
  }

  return (
    <main className="min-h-screen bg-[#f8fbf9] px-5 py-7">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Library</h1>

        <p className="mt-1 text-sm text-slate-500">
          Browse exercises and workouts
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => handleTabChange("workouts")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeTab === "workouts"
              ? "bg-white text-[#1a4332] shadow-sm"
              : "text-slate-500"
          }`}
        >
          Workouts
        </button>

        <button
          onClick={() => handleTabChange("exercises")}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeTab === "exercises"
              ? "bg-white text-[#1a4332] shadow-sm"
              : "text-slate-500"
          }`}
        >
          Exercises
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <Search size={20} className="text-slate-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            activeTab === "exercises"
              ? "Search exercises..."
              : "Search workouts..."
          }
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {activeTab === "exercises" && (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "border-[#1a4332] bg-[#1a4332] text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredExercises.map((exercise) => (
              <ExerciseListItem key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </>
      )}

      {activeTab === "workouts" && (
        <div className="mt-4 space-y-3">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </main>
  );
}

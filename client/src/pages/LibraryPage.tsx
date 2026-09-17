import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { getExercises } from "../api/exercises";
import { getWorkouts } from "../api/workouts";
import { ExerciseListItem } from "../components/ExerciseListItem";
import { WorkoutCard } from "../components/WorkoutCard";
import type { Exercise, Workout } from "../shared/types";
import { C } from "../shared/colors";

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

    return ["All", ...Array.from(new Set(exerciseCategories))];
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
    <main className="min-h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-7 pb-4">
        <h1
          className="mb-4 text-2xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.5px",
          }}
        >
          Library
        </h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.textFaint }}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              activeTab === "workouts"
                ? "Search workouts..."
                : "Search exercises..."
            }
            className="w-full rounded-2xl py-3 pr-4 pl-10 text-sm outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-2xl p-1"
          style={{
            background: C.muted,
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange("workouts")}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
            style={{
              background: activeTab === "workouts" ? C.card : "transparent",
              color: activeTab === "workouts" ? C.forest : C.textMuted,
              boxShadow:
                activeTab === "workouts"
                  ? "0 1px 4px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            Workouts ({workouts.length})
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("exercises")}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
            style={{
              background: activeTab === "exercises" ? C.card : "transparent",
              color: activeTab === "exercises" ? C.forest : C.textMuted,
              boxShadow:
                activeTab === "exercises"
                  ? "0 1px 4px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            Exercises ({exercises.length})
          </button>
        </div>
      </div>

      {/* Exercise categories */}
      {activeTab === "exercises" && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
                style={{
                  background: isSelected ? C.forest : C.card,
                  color: isSelected ? "white" : C.textMuted,
                  border: `1px solid ${isSelected ? C.forest : C.border}`,
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-6">
        {activeTab === "workouts" ? (
          <div className="flex flex-col gap-3">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredExercises.map((exercise) => (
              <ExerciseListItem key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

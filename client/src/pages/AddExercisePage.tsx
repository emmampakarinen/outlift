import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { getExercises } from "../api/exercises";
import { ExerciseCategory } from "../components/ExerciseCategory";
import { ExerciseListItem } from "../components/ExerciseListItem";

import type { Exercise, WorkoutExercise } from "../shared/types";

import { C } from "../shared/colors";
import { useAppNavigation } from "../shared/helpers";
import { BackButton } from "../components/BackButton";
import { useAuth } from "../contexts/useContext";

export function AddExercisePage() {
  const location = useLocation();
  const { goBack } = useAppNavigation();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const draft = location.state?.draft;
  const { token } = useAuth();

  useEffect(() => {
    getExercises(token).then(setExercises);
  }, [token]);

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(exercises.map((exercise) => exercise.category)),
    );

    return ["All", ...uniqueCategories];
  }, [exercises]);

  const addedExerciseIds = new Set(
    draft?.exercises.map((exercise: WorkoutExercise) => exercise.exercise_id) ??
      [],
  );

  function handleAddExercise(exercise: Exercise) {
    const alreadyExists = draft.exercises.some(
      (item: WorkoutExercise) => item.exercise_id === exercise.id,
    );

    const updatedExercises = alreadyExists
      ? draft.exercises
      : [
          ...draft.exercises,
          {
            exercise_id: exercise.id,
            name: exercise.name,
            category: exercise.category,
            primary_muscle: exercise.primary_muscle,
            sets: 1,
            reps: 0,
            weight: null,
          },
        ];

    const updatedDraft = {
      ...draft,
      exercises: updatedExercises,
    };

    goBack({ draft: updatedDraft });
  }

  return (
    <main className="min-h-dvh" style={{ background: C.bg }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 pt-5 pb-4"
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: C.bg,
        }}
      >
        <BackButton onNavigateBack={() => goBack()} />

        <h1 className="text-base font-semibold" style={{ color: C.text }}>
          Add Exercise
        </h1>
      </header>

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.textFaint }}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-2xl py-3 pr-4 pl-10 text-sm outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {categories.map((category) => (
          <ExerciseCategory
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>

      {/* Exercise list */}
      <section className="flex flex-col gap-2.5 px-4 pb-6">
        {filteredExercises.map((exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            onAdd={handleAddExercise}
            isAdded={addedExerciseIds.has(exercise.id)}
          />
        ))}
      </section>
    </main>
  );
}

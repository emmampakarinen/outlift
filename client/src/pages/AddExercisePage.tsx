import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getExercises } from "../api/exercises.ts";
import { ExerciseCategory } from "../components/ExerciseCategory.tsx";
import { Exercise } from "../components/Exercise.tsx";

type Exercise = {
  id: number;
  name: string;
  category: string;
  primary_muscle: string;
};

export function AddExercisePage() {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

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

  function handleAddExercise(exercise: Exercise) {
    console.log("add exercise to workout:", workoutId, exercise);
  }

  return (
    <main className="min-h-screen bg-[#f8fbf9]">
      <header className="flex items-center gap-4 border-b border-slate-200 px-5 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4332] shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-xl font-bold text-slate-900">Add Exercise</h1>
      </header>

      <div className="px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <Search size={20} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <ExerciseCategory
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>

        <section className="mt-4 space-y-3">
          {filteredExercises.map((exercise) => (
            <Exercise exercise={exercise} onAdd={handleAddExercise} />
          ))}
        </section>
      </div>
    </main>
  );
}

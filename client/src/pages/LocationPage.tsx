import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Location } from "../shared/types";
import { getWorkoutsByLocation } from "../api/workouts";
import { WorkoutCard } from "../components/WorkoutCard";
import { getLocationById } from "../api/locations";
import { ArrowLeft } from "lucide-react";

export function LocationPage() {
  const { locationId } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState<Location | null>(null);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!locationId) return;

    getLocationById(Number(locationId)).then(setLocation);
    getWorkoutsByLocation(Number(locationId)).then(setWorkouts);
  }, [locationId]);

  return (
    <main className="px-5 pt-7 pb-8">
      <header className="relative flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a4332] shadow-md transition hover:scale-105"
        >
          <ArrowLeft size={24} strokeWidth={2.2} />
        </button>

        <h1 className="px-14 text-center text-2xl font-bold text-slate-900">
          {location?.name ?? "Location"}
        </h1>
      </header>

      <p className="mt-6 text-slate-500">{location?.description}</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Workouts here</h2>

        <div className="mt-4 space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} {...workout} />
          ))}
        </div>
      </section>
      <button className="mt-10 w-full rounded-2xl bg-[#1a4332] px-5 py-4 text-base font-semibold text-white transition hover:opacity-90">
        Start Workout Here
      </button>
    </main>
  );
}

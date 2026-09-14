import { useEffect, useState } from "react";
import { HomeHeader } from "../components/HomeHeader";
import { MapPreview } from "../components/MapPreview";
import { NearbySpotCard } from "../components/NearbySpotCard";
import { WorkoutCard } from "../components/WorkoutCard";
import { getWorkouts } from "../api/workouts";
import type { Location } from "../shared/types";
import { getLocations } from "../api/locations";

export function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [locations, setLocations] = useState<Location[]>([]);

  async function loadLocations() {
    const data = await getLocations();
    setLocations(data);
  }

  useEffect(() => {
    getWorkouts().then(setWorkouts);
    getLocations().then(setLocations);
  }, []);

  return (
    <main className="px-5 pt-7 pb-8">
      <HomeHeader />

      <section className="mt-8">
        <MapPreview locations={locations} onLocationsChange={loadLocations} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">
          Recently saved spots
        </h2>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {[...locations]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 5)
            .map((location) => (
              <NearbySpotCard
                key={location.id}
                name={location.name}
                description={location.description}
              />
            ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Recent Workouts</h2>

        <div className="mt-4 space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} {...workout} />
          ))}
        </div>
      </section>
    </main>
  );
}

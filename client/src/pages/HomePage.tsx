import { useEffect, useState } from "react";
import { getLocations } from "../api/locations";
import { getWorkouts } from "../api/workouts";
import { HomeHeader } from "../components/HomeHeader";
import { MapPreview } from "../components/MapPreview";
import { SavedLocationCard } from "../components/SavedLocationCard";
import { WorkoutCard } from "../components/WorkoutCard";
import type { Location, Workout } from "../shared/types";
import { C } from "../shared/colors";
import { useAuth } from "../contexts/useContext";

export function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    getWorkouts(token).then(setWorkouts);
    getLocations(token).then(setLocations);
  }, [token]);

  const recentlySavedLocations = [...locations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <main className="min-h-full pb-8" style={{ background: C.bg }}>
      <div className="px-5 pt-7 pb-4">
        <HomeHeader />
      </div>

      <section className="mx-4 mb-5">
        <MapPreview locations={locations} />
      </section>

      <section className="mb-5">
        <div className="px-5 mb-3">
          <h2 className="text-sm font-semibold" style={{ color: C.text }}>
            Recently Saved Spots
          </h2>
        </div>

        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {recentlySavedLocations.length > 0 ? (
            recentlySavedLocations.map((location) => (
              <SavedLocationCard
                key={location.id}
                id={location.id}
                name={location.name}
                description={location.description}
              />
            ))
          ) : (
            <p className="text-sm" style={{ color: C.textFaint }}>
              Add a location to start creating workouts.
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="px-5 mb-3">
          <h2 className="text-sm font-semibold" style={{ color: C.text }}>
            Recent Workouts
          </h2>
        </div>

        <div className="flex flex-col gap-3 px-4">
          {workouts.length > 0 ? (
            workouts.slice(0, 3).map((workout) => {
              const location = locations.find(
                (location) => location.id === workout.locationId,
              );

              return (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  locationName={location?.name}
                />
              );
            })
          ) : (
            <p className="text-sm" style={{ color: C.textFaint }}>
              No workouts yet. Add a location and create your first workout.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

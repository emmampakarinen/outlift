import { useEffect, useState } from "react";
import { Dumbbell, MapPin } from "lucide-react";
import { useParams } from "react-router-dom";

import type { Location, LocationEquipment, Workout } from "../shared/types";
import { getWorkoutsByLocation } from "../api/workouts";
import {
  deleteLocation,
  getLocationById,
  getLocationEquipment,
} from "../api/locations";
import { WorkoutCard } from "../components/WorkoutCard";
import { useAppNavigation } from "../shared/helpers";
import { C } from "../shared/colors";
import { useAuth } from "../contexts/useContext";
import { BackButton } from "../components/BackButton";
import { StatCard } from "../components/StatCard";
import { EquipmentChips } from "../components/EquipmentChips";
import { LocationMap } from "../components/LocationMap";
import { APIProvider } from "@vis.gl/react-google-maps";

export function LocationPage() {
  const { locationId } = useParams();
  const { goTo, goBack } = useAppNavigation();
  const { token } = useAuth();

  const [location, setLocation] = useState<Location | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [locationEquipment, setLocationEquipment] = useState<
    LocationEquipment[]
  >([]);

  useEffect(() => {
    if (!locationId) return;

    getLocationById(Number(locationId), token).then(setLocation);
    getWorkoutsByLocation(Number(locationId), token).then(setWorkouts);
    getLocationEquipment(Number(locationId), token).then(setLocationEquipment);
  }, [locationId, token]);

  if (!location) {
    return <main className="min-h-full" style={{ background: C.bg }} />;
  }

  const averageDuration =
    workouts.length > 0
      ? Math.round(
          workouts.reduce(
            (total, workout) => total + workout.duration_minutes,
            0,
          ) / workouts.length,
        )
      : 0;

  async function handleDeleteLocation() {
    if (!locationId || !token) return;

    await deleteLocation(Number(locationId), token);

    goBack();
  }

  // TODO use locationmap-component here
  return (
    <main className="min-h-dvh" style={{ background: C.bg }}>
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <LocationMap
            locations={[location]}
            focusPosition={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
            interactive={false}
          />
        </APIProvider>

        <BackButton onNavigateBack={() => goBack()} variant="overlay" />
      </div>

      <div className="px-5 pt-5 pb-8">
        {/* Name */}
        <h1
          className="text-xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.3px",
          }}
        >
          {location.name}
        </h1>

        <div className="mt-1 flex items-center gap-1.5">
          <MapPin size={12} style={{ color: C.textFaint }} />

          <span className="text-sm" style={{ color: C.textMuted }}>
            {location.address}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard label="My Sessions" value={workouts.length} />

          <StatCard
            label="Avg Duration"
            value={averageDuration > 0 ? `${averageDuration}m` : "–"}
          />

          <StatCard label="Workouts" value={workouts.length} />
        </div>

        {/* Description */}
        {location.description && (
          <p
            className="mt-5 text-sm leading-relaxed"
            style={{ color: C.textSub }}
          >
            {location.description}
          </p>
        )}

        <section className="mt-5">
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: C.textMuted }}
          >
            Amenities & Equipment
          </h2>
          <EquipmentChips equipment={locationEquipment} />
        </section>

        {/* Workouts */}
        {workouts.length > 0 && (
          <section className="mt-6">
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.textMuted }}
            >
              Your Workouts Here
            </h2>

            <div className="flex flex-col gap-3">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  locationName={location.name}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {workouts.length === 0 && (
          <div
            className="mt-6 rounded-2xl p-6 text-center"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <Dumbbell
              size={24}
              className="mx-auto mb-2"
              style={{ color: C.sage }}
            />

            <p className="text-sm font-semibold" style={{ color: C.text }}>
              No workouts here yet
            </p>

            <p className="mt-1 text-xs" style={{ color: C.textMuted }}>
              Add your first workout at this location.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => goTo(`/locations/${locationId}/workouts/new`)}
          className="mt-6 w-full rounded-2xl py-4 text-sm font-semibold"
          style={{
            background: C.forest,
            color: "white",
          }}
        >
          Create New Workout Here
        </button>

        <button
          type="button"
          onClick={() => goTo(`/locations/${locationId}/edit`)}
          className="mt-3 w-full rounded-2xl py-4 text-sm font-semibold"
          style={{
            background: C.card,
            color: C.forest,
            border: `1px solid ${C.border}`,
          }}
        >
          Edit Location
        </button>

        <button
          type="button"
          onClick={handleDeleteLocation}
          className="mt-3 w-full rounded-2xl py-4 text-sm font-semibold"
          style={{
            background: C.dangerLight,
            color: C.danger,
            border: `1px solid ${C.danger}`,
          }}
        >
          Delete Location
        </button>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { ArrowLeft, Dumbbell, MapPin } from "lucide-react";
import { useParams } from "react-router-dom";

import type { Location, Workout } from "../shared/types";
import { getWorkoutsByLocation } from "../api/workouts";
import { getLocationById } from "../api/locations";
import { WorkoutCard } from "../components/WorkoutCard";
import { useAppNavigation } from "../shared/helpers";
import { C } from "../shared/colors";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useAuth } from "../contexts/useContext";

export function LocationPage() {
  const { locationId } = useParams();
  const { goTo, goBack } = useAppNavigation();
  const { token } = useAuth();

  const [location, setLocation] = useState<Location | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (!locationId) return;

    getLocationById(Number(locationId), token).then(setLocation);
    getWorkoutsByLocation(Number(locationId), token).then(setWorkouts);
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

  return (
    <main className="min-h-dvh" style={{ background: C.bg }}>
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            center={{
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            }}
            zoom={15}
            mapId="DEMO_MAP_ID"
            disableDefaultUI
            gestureHandling="none"
            className="h-full w-full"
          >
            <AdvancedMarker
              position={{
                lat: Number(location.latitude),
                lng: Number(location.longitude),
              }}
              title={location.name}
            />
          </Map>
        </APIProvider>

        <button
          type="button"
          onClick={() => goBack()}
          className="absolute top-5 left-4 flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: C.text,
            boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
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
            Outdoor training spot
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
          Start Workout Here
        </button>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl p-3 text-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      <p className="text-lg font-bold" style={{ color: C.forest }}>
        {value}
      </p>

      <p className="mt-0.5 text-xs" style={{ color: C.textMuted }}>
        {label}
      </p>
    </div>
  );
}

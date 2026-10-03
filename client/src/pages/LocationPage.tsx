import { useEffect, useState } from "react";
import {
  Check,
  Dumbbell,
  Globe2,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";

import type {
  GenerateWorkoutSpecs,
  Location,
  LocationEquipment,
  Workout,
  WorkoutDraft,
} from "../shared/types";
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
import { GenerateWorkoutModal } from "../components/modals/GenerateWorkoutModal";
import { generateWorkout } from "../api/ai";

export function LocationPage() {
  const { locationId } = useParams();
  const { goTo, goBack } = useAppNavigation();
  const { token, user } = useAuth();

  const [location, setLocation] = useState<Location | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [locationEquipment, setLocationEquipment] = useState<
    LocationEquipment[]
  >([]);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [generateSpecs, setGenerateSpecs] = useState<GenerateWorkoutSpecs>({
    durationMinutes: 45,
    intensity: "moderate",
    workoutType: "strength",
    muscleGroup: "full-body",
  });

  useEffect(() => {
    if (!locationId) return;

    getLocationById(Number(locationId), token).then(setLocation);
    getWorkoutsByLocation(Number(locationId), token).then(setWorkouts);
    getLocationEquipment(Number(locationId), token).then(setLocationEquipment);
  }, [locationId, token]);

  if (!location) {
    return <main className="min-h-full" style={{ background: C.bg }} />;
  }

  const isOwner = user?.id === location?.createdBy;

  const averageDuration =
    workouts.length > 0
      ? Math.round(
          workouts.reduce(
            (total, workout) => total + workout.durationMinutes,
            0,
          ) / workouts.length,
        )
      : 0;

  async function handleDeleteLocation() {
    if (!locationId || !token) return;

    await deleteLocation(Number(locationId), token);

    goBack();
  }

  async function handleGenerateWorkout() {
    try {
      setIsGenerating(true);

      const generatedWorkout = await generateWorkout(
        {
          ...generateSpecs,
          locationId: location.id,
        },
        token,
      );

      const draft: WorkoutDraft = {
        locationId: location.id,
        name: generatedWorkout.name,
        description: generatedWorkout.description,
        durationMinutes: String(generatedWorkout.durationMinutes),
        intensity: generateSpecs.intensity,
        workoutType: generateSpecs.workoutType,
        muscleGroup: generateSpecs.muscleGroup,
        exercises: generatedWorkout.exercises,
      };

      setShowGenerateModal(false);

      goTo(`/locations/${location.id}/workouts/new`, {
        draft,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-dvh" style={{ background: C.bg }}>
      {/* Map */}
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

        {/* Address */}
        <div className="mt-1 flex items-center gap-1.5">
          <MapPin size={12} style={{ color: C.textFaint }} />

          <span className="text-sm" style={{ color: C.textMuted }}>
            {location.address}
          </span>
        </div>

        {/* Ownership / visibility */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background: isOwner ? C.sageLight : C.communityLight,
              color: isOwner ? C.forest : C.textSub,
            }}
          >
            {isOwner ? (
              <>
                <Check size={11} />
                Your location
              </>
            ) : (
              <>
                <Globe2 size={12} />
                Community spot
              </>
            )}
          </span>

          <span className="text-xs" style={{ color: C.textMuted }}>
            {isOwner
              ? location.isPublic
                ? "Shared publicly"
                : "Private · only you can see this"
              : "Shared by another Outlift member"}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard label="My Sessions" value={workouts.length} />

          <StatCard
            label="Avg Duration"
            value={averageDuration > 0 ? `${averageDuration}m` : "–"}
          />

          <StatCard label="Equipment" value={locationEquipment.length} />
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

        {/* Equipment */}
        {locationEquipment.length > 0 && (
          <section className="mt-5">
            <h2
              className="mb-3 text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.textMuted }}
            >
              Amenities & Equipment
            </h2>

            <EquipmentChips equipment={locationEquipment} />
          </section>
        )}

        {/* Workout builder */}
        <section
          className="mt-6 rounded-2xl p-4"
          style={{
            background: C.forest,
            color: "white",
          }}
        >
          <div className="mb-4 flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: C.sage,
              }}
            >
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Build a workout for this spot
              </h2>

              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Use the available equipment to create a session that fits your
                goals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGenerateModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
            style={{
              background: C.sage,
              color: C.forest,
            }}
          >
            <Sparkles size={15} />
            Generate with AI
          </button>

          <button
            type="button"
            onClick={() => goTo(`/locations/${locationId}/workouts/new`)}
            className="mt-2 w-full rounded-xl py-3 text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.16)",
            }}
          >
            Create manually
          </button>
        </section>

        {/* Workouts */}
        {workouts.length > 0 ? (
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
        ) : (
          <div
            className="mt-6 rounded-2xl p-5 text-center"
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
              Create the first workout tailored to this location.
            </p>
          </div>
        )}

        {/* Owner actions */}
        {isOwner && (
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => goTo(`/locations/${locationId}/edit`)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold"
              style={{
                background: C.card,
                color: C.forest,
                border: `1px solid ${C.border}`,
              }}
            >
              <Pencil size={14} />
              Edit location
            </button>

            <button
              type="button"
              onClick={handleDeleteLocation}
              aria-label="Delete location"
              className="rounded-xl px-4 py-3"
              style={{
                background: C.dangerLight,
                color: C.danger,
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {showGenerateModal && (
        <GenerateWorkoutModal
          specs={generateSpecs}
          onChange={setGenerateSpecs}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateWorkout}
          isGenerating={isGenerating}
        />
      )}
    </main>
  );
}

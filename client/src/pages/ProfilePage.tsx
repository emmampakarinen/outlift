import { useEffect, useMemo, useState } from "react";
import { ChevronRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useContext";
import { getWorkouts } from "../api/workouts";
import type { Workout } from "../shared/types";
import { C } from "../shared/colors";

function ProfilePage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (!token) return;

    getWorkouts(token).then(setWorkouts);
  }, [token]);

  const stats = useMemo(() => {
    const totalMinutes = workouts.reduce(
      (sum, workout) => sum + workout.duration_minutes,
      0,
    );

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    const uniqueLocations = new Set(
      workouts.map((workout) => workout.location_id),
    );

    return {
      workouts: workouts.length,
      locations: uniqueLocations.size,
      hours: totalHours,
    };
  }, [workouts]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <main className="min-h-full" style={{ background: C.bg }}>
      <div className="px-5 pt-7 pb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.5px",
          }}
        >
          Profile
        </h1>
      </div>

      <div className="flex flex-col items-center px-5">
        {/* Profile image */}
        <div
          className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
          style={{
            background: C.sageLight,
            border: `3px solid ${C.sageLight}`,
          }}
        >
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={38} style={{ color: C.forest }} />
          )}
        </div>

        {/* User info */}
        <h2 className="mb-0.5 text-lg font-bold" style={{ color: C.text }}>
          {user?.username ?? "User"}
        </h2>

        <p className="mb-5 text-sm text-center" style={{ color: C.textMuted }}>
          {user?.profile_description || "Outdoor fitness enthusiast"}
        </p>

        {/* Stats */}
        <div className="mb-6 grid w-full grid-cols-3 gap-3">
          <StatCard label="Workouts" value={stats.workouts} />

          <StatCard label="Spots" value={stats.locations} />

          <StatCard label="Hours" value={stats.hours} />
        </div>

        {/* Settings */}
        <div
          className="mb-4 w-full overflow-hidden rounded-2xl"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
          }}
        >
          <ProfileRow label="Email" hint={user?.email ?? ""} />

          <ProfileRow label="Personal Records" hint="Coming soon" />

          <ProfileRow label="Achievements" hint="Coming soon" />

          <ProfileRow label="Units" hint="Metric (kg)" last />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mb-8 w-full rounded-2xl py-3.5 text-sm font-semibold"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: "#EF4444",
          }}
        >
          Log Out
        </button>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl p-3.5 text-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      <p className="text-xl font-bold" style={{ color: C.forest }}>
        {value}
      </p>

      <p className="mt-0.5 text-xs" style={{ color: C.textMuted }}>
        {label}
      </p>
    </div>
  );
}

function ProfileRow({
  label,
  hint,
  last = false,
}: {
  label: string;
  hint: string;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      style={{
        borderBottom: last ? "none" : `1px solid ${C.border}`,
      }}
    >
      <span className="text-sm font-medium" style={{ color: C.text }}>
        {label}
      </span>

      <div className="flex items-center gap-1.5">
        <span
          className="max-w-40 truncate text-xs"
          style={{ color: C.textMuted }}
        >
          {hint}
        </span>

        <ChevronRight size={15} style={{ color: C.textFaint }} />
      </div>
    </button>
  );
}

export default ProfilePage;

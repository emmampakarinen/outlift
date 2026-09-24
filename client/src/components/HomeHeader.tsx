import { UserRound } from "lucide-react";
import { C } from "../shared/colors";
import { useAuth } from "../contexts/useContext";

export function HomeHeader() {
  const { user } = useAuth();

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    if (hour < 21) {
      return "Good evening";
    }

    return "Good night";
  }

  return (
    <header className="flex items-center justify-between">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: C.sage }}
        >
          {getGreeting()}
        </p>

        <h1
          className="text-2xl font-bold"
          style={{
            color: C.text,
            letterSpacing: "-0.5px",
          }}
        >
          Outlift
        </h1>
      </div>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
        style={{
          background: C.sageLight,
          border: `2px solid ${C.border}`,
        }}
      >
        {user?.profile_picture_url ? (
          <img
            src={user.profile_picture_url}
            alt={user.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound size={20} style={{ color: C.forest }} />
        )}
      </button>
    </header>
  );
}

import { useNavigate } from "react-router-dom";
import { C } from "../shared/colors";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main
      className="relative min-h-dvh overflow-hidden"
      style={{ background: "#0D2418" }}
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=1200&fit=crop&auto=format"
          alt="Outdoor training"
          className="h-full w-full object-cover"
          style={{ opacity: 0.55 }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,36,24,0.5) 0%, transparent 35%, rgba(13,36,24,0.75) 65%, rgba(13,36,24,0.97) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-6">
        <div className="flex flex-1 flex-col justify-end pb-8 pt-16">
          <div className="mb-5">
            <span
              className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(116,198,157,0.2)",
                color: C.sage,
                borderColor: "rgba(116,198,157,0.35)",
              }}
            >
              Outdoor Training
            </span>
          </div>

          <h1
            className="mb-3 text-5xl font-bold leading-none"
            style={{
              color: "white",
              letterSpacing: "-1.5px",
            }}
          >
            Train
            <br />
            Anywhere.
          </h1>

          <p
            className="mb-10 max-w-[280px] text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Discover outdoor training spots, log your workouts, and track
            progress — wherever you are.
          </p>

          <div className="mb-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full rounded-2xl py-4 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                background: C.sage,
                color: C.forest,
              }}
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full rounded-2xl py-4 text-sm font-semibold transition active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

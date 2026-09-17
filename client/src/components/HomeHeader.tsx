import { C } from "../shared/colors";

export function HomeHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: C.sage }}
        >
          Good morning
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
        className="h-10 w-10 overflow-hidden rounded-full"
        style={{
          border: `2px solid ${C.border}`,
        }}
      >
        <img
          src="/images/profile.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </button>
    </header>
  );
}

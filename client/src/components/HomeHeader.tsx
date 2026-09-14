export function HomeHeader() {
  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">
          Good morning
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
          Outlift
        </h1>
      </div>

      <button className="h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm">
        <img
          src="/images/profile.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </button>
    </header>
  );
}
import { Clock, Dumbbell } from "lucide-react";

type WorkoutCardProps = {
  name: string;
  description: string;
  duration_minutes: string;
};

export function WorkoutCard({
  name,
  duration_minutes,
}: WorkoutCardProps) {
  return (
    <button className="flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[0.99]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
        <Dumbbell size={24} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-slate-900">
          {name}
        </h3>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-sm text-slate-400">
        <Clock size={16} />
        <span>{duration_minutes}</span>
      </div>
    </button>
  );
}
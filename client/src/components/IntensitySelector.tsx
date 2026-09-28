import { WORKOUT_INTENSITIES } from "../shared/types";
import { C, INTENSITY_COLORS } from "../shared/colors";
import { formatLabel } from "../shared/helpers";

type IntensitySelectorProps = {
  value: (typeof WORKOUT_INTENSITIES)[number];
  onChange: (intensity: (typeof WORKOUT_INTENSITIES)[number]) => void;
};

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <div className="grid w-full grid-cols-[1fr_1.15fr_1fr_1fr] gap-2">
      {WORKOUT_INTENSITIES.map((intensity) => {
        const selected = value === intensity;
        const colors = INTENSITY_COLORS[intensity];

        return (
          <button
            key={intensity}
            type="button"
            onClick={() => onChange(intensity)}
            className="flex min-w-0 items-center justify-center rounded-2xl px-2 py-3 text-xs font-semibold transition"
            style={{
              background: selected ? colors.background : C.card,
              border: `1px solid ${selected ? colors.border : C.border}`,
              color: selected ? colors.text : C.textSub,
              boxShadow: selected ? `0 0 0 1px ${colors.border}` : "none",
            }}
          >
            {formatLabel(intensity)}
          </button>
        );
      })}
    </div>
  );
}

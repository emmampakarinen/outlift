import type { ReactNode } from "react";
import { C } from "../shared/colors";

type AuthFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rightSlot?: ReactNode;
};

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot,
}: AuthFieldProps) {
  return (
    <div className="mb-4">
      <label
        className="mb-2 block text-xs font-semibold uppercase tracking-wider"
        style={{ color: C.textMuted }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.text,
            paddingRight: rightSlot ? 48 : 16,
          }}
        />

        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

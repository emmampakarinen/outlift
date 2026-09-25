import { ChevronDown } from "lucide-react";
import { C } from "../shared/colors";

type Option = {
  value: string;
  label: string;
};

type FormFieldProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;

  type?: "text" | "number" | "select";

  placeholder?: string;
  min?: number;
  options?: Option[];
};

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  options = [],
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label
        className="mb-2 block text-xs font-semibold uppercase tracking-wider"
        style={{ color: C.textMuted }}
      >
        {label}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full appearance-none rounded-2xl px-4 py-3.5 pr-11 text-base font-medium outline-none"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: C.textMuted }}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          min={min}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl px-4 py-3 text-base font-medium outline-none"
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        />
      )}
    </div>
  );
}

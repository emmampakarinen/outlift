import type { ReactNode } from "react";
import { C } from "../shared/colors";

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-3.5 text-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      {icon && (
        <div className="mb-1 flex justify-center" style={{ color: C.sage }}>
          {icon}
        </div>
      )}

      <p
        className="text-lg font-bold"
        style={{ color: icon ? C.text : C.forest }}
      >
        {value}
      </p>

      <p className="text-xs" style={{ color: C.textMuted }}>
        {label}
      </p>
    </div>
  );
}

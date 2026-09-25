import type { CSSProperties, ReactNode } from "react";

type InfoChipProps = {
  children: ReactNode;
  background: string;
  color: string;
  border?: string;
  style?: CSSProperties;
};

export function InfoChip({
  children,
  background,
  color,
  border,
  style,
}: InfoChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background,
        color,
        border: border ? `1px solid ${border}` : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

import { ArrowLeft } from "lucide-react";
import { C } from "../shared/colors";

type BackButtonProps = {
  onNavigateBack: () => void;
  variant?: "inline" | "overlay";
};

export function BackButton({
  onNavigateBack,
  variant = "inline",
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onNavigateBack}
      className={
        variant === "overlay"
          ? "absolute left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-md"
          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm"
      }
      style={{
        background: C.card,
        color: C.text,
        border: `1px solid ${C.border}`,
      }}
    >
      <ArrowLeft size={20} />
    </button>
  );
}

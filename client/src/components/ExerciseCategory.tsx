import { C } from "../shared/colors";

type Props = {
  category: string;
  isSelected: boolean;
  setSelectedCategory: (category: string) => void;
};

export function ExerciseCategory({
  category,
  isSelected,
  setSelectedCategory,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => setSelectedCategory(category)}
      className="shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold"
      style={{
        background: isSelected ? C.forest : C.card,
        color: isSelected ? "white" : C.textMuted,
        border: `1px solid ${isSelected ? C.forest : C.border}`,
      }}
    >
      {category}
    </button>
  );
}

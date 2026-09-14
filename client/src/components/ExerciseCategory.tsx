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
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        isSelected
          ? "bg-[#1a4332] text-white"
          : "border border-slate-200 bg-white text-slate-500"
      }`}
    >
      {category}
    </button>
  );
}

type Props = {
  name: string;
  description: string;
  disabled: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
};

export function LocationForm({
  name,
  description,
  disabled,
  onNameChange,
  onDescriptionChange,
  onSave,
}: Props) {
  return (
    <div className="space-y-4 border-t border-slate-200 bg-white p-5">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. Töölö outdoor gym"
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <button
        onClick={onSave}
        disabled={disabled}
        className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white disabled:opacity-40"
      >
        Save training spot
      </button>
    </div>
  );
}

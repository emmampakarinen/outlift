import { C } from "../shared/colors";

type Props = {
  defaultValue?: string;
  setInput: (value: string) => void;
};

export function InputField({ defaultValue, setInput }: Props) {
  return (
    <input
      value={defaultValue}
      onChange={(event) => setInput(event.target.value)}
      placeholder="e.g. Sunken Gardens Park"
      className="w-full rounded-2xl px-4 py-3 text-base font-medium outline-none"
      style={{
        background: C.card,
        border: `1.5px solid ${defaultValue.trim() ? C.forest : C.border}`,
        color: C.text,
      }}
    />
  );
}

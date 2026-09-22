import { C } from "../shared/colors";

type Props = {
  actionAllowed: boolean;
  handleAction: () => void;
};

export function ActionButton({ actionAllowed, handleAction }: Props) {
  return (
    <button
      type="button"
      disabled={!actionAllowed}
      onClick={handleAction}
      className="rounded-full px-4 py-2 text-sm font-semibold"
      style={{
        background: actionAllowed ? C.forest : C.muted,
        color: actionAllowed ? "white" : C.textFaint,
      }}
    >
      Save
    </button>
  );
}

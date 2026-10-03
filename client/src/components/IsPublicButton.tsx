import { C } from "../shared/colors";

type Props = {
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
};

export default function IsPublicButton({ isPublic, setIsPublic }: Props) {
  return (
    <section className="mb-8">
      <div
        className="flex items-center justify-between gap-4 rounded-2xl p-4"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: C.text }}>
            Share this location
          </p>

          <p className="mt-1 text-xs" style={{ color: C.textFaint }}>
            Make this location visible to other users
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          onClick={() => setIsPublic(!isPublic)}
          className="relative h-6 w-11 shrink-0 rounded-full transition"
          style={{
            background: isPublic ? C.forest : C.muted,
          }}
        >
          <span
            className="absolute top-1 h-4 w-4 rounded-full bg-white transition-all"
            style={{
              left: isPublic ? 24 : 4,
            }}
          />
        </button>
      </div>
    </section>
  );
}

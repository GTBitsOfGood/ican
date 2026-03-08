import { getChildPatternTiles } from "@/lib/childPasswordTiles";
import { ChildPasswordType } from "@/types/user";

interface ChildColorPickerProps {
  sequence: string[];
  onAddColor: (token: string) => void;
  onClear: () => void;
  view?: "login" | "change";
  passwordType?: ChildPasswordType;
  showInstruction?: boolean;
}

export default function ChildColorPicker({
  sequence,
  onAddColor,
  onClear,
  view = "login",
  passwordType = ChildPasswordType.COLOR,
  showInstruction = true,
}: ChildColorPickerProps) {
  const squareBorderClass = "border border-black/10";
  const previewTextClass = "text-black";
  const instructionTextClass =
    view === "change" ? "text-white/80" : "text-textGrey";
  const tiles = getChildPatternTiles(passwordType);
  const instruction =
    passwordType === ChildPasswordType.SHAPE
      ? "Tap shapes in order"
      : passwordType === ChildPasswordType.EMOJI
        ? "Tap emojis in order"
        : "Tap colors in order";
  const tileTextClass =
    passwordType === ChildPasswordType.SHAPE
      ? "text-4xl leading-none text-black"
      : passwordType === ChildPasswordType.EMOJI
        ? "text-3xl leading-none"
        : "text-[14px] leading-none text-black";
  const handleTileSelect = (token: string) => {
    if (sequence.length >= 4) {
      return;
    }
    onAddColor(token);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {showInstruction && (
        <span className={`text-sm self-start ${instructionTextClass}`}>
          {instruction}
        </span>
      )}
      <div className="grid grid-cols-3 gap-3 w-fit mx-auto place-items-center">
        {tiles.map((tileOption, index) => (
          <button
            key={tileOption.token}
            type="button"
            aria-label={tileOption.label}
            className={`group relative size-[90px] rounded-[4px] ${squareBorderClass} flex items-center justify-center ${tileTextClass}`}
            onClick={() => handleTileSelect(tileOption.token)}
            style={tileOption.style}
          >
            {tileOption.content || index + 1}
            <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
              {tileOption.label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        {Array.from({ length: 4 }, (_, index) => {
          const token = sequence[index];
          const option = token
            ? tiles.find((item) => item.token === token)
            : undefined;
          return (
            <div
              key={`${token ?? "empty"}-${index}`}
              title={option?.label || "Empty"}
              className={`size-[50px] rounded-[4px] bg-[#FBF8F8] ${squareBorderClass} ${previewTextClass} flex items-center justify-center text-xl`}
              style={option?.style}
            >
              {option?.content || ""}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-1 flex items-center gap-2 text-[16px]/[16px] tracking-[-0.04em] text-[#C6C6C6] disabled:opacity-70"
        onClick={onClear}
        disabled={sequence.length === 0}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C6C6C6] text-[14px] leading-none text-white">
          ×
        </span>
        <span>Clear Password</span>
      </button>
    </div>
  );
}

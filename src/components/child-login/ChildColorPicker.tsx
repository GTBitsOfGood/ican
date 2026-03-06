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
  const isDark = view === "change";
  const labelClass = isDark ? "text-white" : "text-textGrey";
  const tileBorderClass = isDark ? "border-black" : "border-borderGrey";
  const previewBorderClass = isDark ? "border-white" : "border-borderGrey";
  const previewTextClass = isDark ? "text-white" : "text-textGrey";
  const clearButtonClass = isDark
    ? "border-white text-black bg-white"
    : "border-borderGrey text-textGrey bg-white";
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
        : "text-2xl leading-none text-black";

  return (
    <div className="flex flex-col items-center gap-2">
      {showInstruction && (
        <span className={`${labelClass} text-sm self-start`}>
          {instruction}
        </span>
      )}
      <div className="grid grid-cols-3 gap-2 w-fit mx-auto place-items-center">
        {tiles.map((tileOption, index) => (
          <button
            key={tileOption.token}
            type="button"
            aria-label={tileOption.label}
            className={`group relative ${view === "login" ? "size-14" : "size-20"} border-2 ${tileBorderClass} flex items-center justify-center ${tileTextClass}`}
            onClick={() => onAddColor(tileOption.token)}
            style={tileOption.style}
          >
            {tileOption.content || index + 1}
            <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
              {tileOption.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 4 }, (_, index) => {
          const token = sequence[index];
          const option = token
            ? tiles.find((item) => item.token === token)
            : undefined;
          return (
            <div
              key={`${token ?? "empty"}-${index}`}
              title={option?.label || "Empty"}
              className={`size-10 border ${previewBorderClass} ${previewTextClass} flex items-center justify-center text-xl`}
              style={option?.style}
            >
              {option?.content || ""}
            </div>
          );
        })}
      </div>
      {view === "change" && (
        <button
          type="button"
          className={`w-fit px-3 py-1 border ${clearButtonClass}`}
          onClick={onClear}
        >
          Clear pattern
        </button>
      )}
    </div>
  );
}

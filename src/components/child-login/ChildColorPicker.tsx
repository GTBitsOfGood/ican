import { childPasswordTiles } from "@/lib/childPasswordTiles";

interface ChildColorPickerProps {
  sequence: string[];
  onAddColor: (token: string) => void;
  onClear: () => void;
  view?: "login" | "change";
}

export default function ChildColorPicker({
  sequence,
  onAddColor,
  onClear,
  view = "login",
}: ChildColorPickerProps) {
  const isDark = view === "change";
  const labelClass = isDark ? "text-white" : "text-textGrey";
  const tileBorderClass = isDark ? "border-black" : "border-borderGrey";
  const previewBorderClass = isDark ? "border-white" : "border-borderGrey";
  const previewTextClass = isDark ? "text-white" : "text-textGrey";
  const clearButtonClass = isDark
    ? "border-white text-black bg-white"
    : "border-borderGrey text-textGrey bg-white";

  return (
    <div className="flex flex-col gap-2">
      <span className={`${labelClass} text-sm`}>Tap colors in order</span>
      <div className="grid grid-cols-4 gap-2">
        {childPasswordTiles.map((colorOption, index) => (
          <button
            key={colorOption.token}
            type="button"
            aria-label={colorOption.label}
            className={`group relative h-10 border-2 ${tileBorderClass} text-sm font-bold`}
            onClick={() => onAddColor(colorOption.token)}
            style={colorOption.style}
          >
            {index}
            <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
              {colorOption.label}
            </span>
          </button>
        ))}
      </div>
      <div
        className={`min-h-10 px-2 py-1 border ${previewBorderClass} ${previewTextClass} flex flex-wrap items-center gap-2`}
      >
        {sequence.length > 0
          ? sequence.map((token, index) => {
              const option = childPasswordTiles.find(
                (item) => item.token === token,
              );
              return (
                <div
                  key={`${token}-${index}`}
                  title={option?.label || token}
                  className={`size-6 border ${previewBorderClass}`}
                  style={option?.style}
                />
              );
            })
          : "No colors selected"}
      </div>
      <button
        type="button"
        className={`w-fit px-3 py-1 border ${clearButtonClass}`}
        onClick={onClear}
      >
        Clear pattern
      </button>
    </div>
  );
}

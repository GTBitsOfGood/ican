import { getChildPatternTiles } from "@/lib/childPasswordTiles";
import { ChildPasswordType } from "@/types/user";
import Image from "next/image";

interface ChildColorPickerProps {
  sequence: string[];
  onAddColor: (token: string) => void;
  onClear: () => void;
  onRemoveColor?: (token: string) => void;
  view?: "login" | "change";
  passwordType?: ChildPasswordType;
  showInstruction?: boolean;
}

const SQUARE_BORDER_CLASS = "border border-black/10";
const PATTERN_IMAGE_MAP: Record<string, string> = {
  pattern1: "pattern-1.svg",
  pattern2: "pattern-2.svg",
  pattern3: "pattern-3.svg",
  pattern4: "pattern-4.svg",
  pattern5: "pattern-5.svg",
  pattern6: "pattern-6.svg",
  pattern7: "pattern-7.svg",
  pattern8: "pattern-8.svg",
  pattern9: "pattern-9.svg",
};
const SHAPE_SIZES: Record<string, { width: number; height: number }> = {
  circle: { width: 78.85, height: 78.85 },
  square: { width: 65.88, height: 61.09 },
  triangle: { width: 70.31, height: 72.84 },
  diamond: { width: 63.26, height: 70.22 },
  star: { width: 60.9, height: 60.9 },
  heart: { width: 67.5, height: 52.5 },
  club: { width: 63.65, height: 63.97 },
  spade: { width: 61.75, height: 61.75 },
  sun: { width: 68.48, height: 68.48 },
};
const SHAPE_IMAGE_MAP: Record<string, { base: string; selected: string }> = {
  // Keep legacy token keys stable for credential matching.
  // Display assets map to updated design names from Figma.
  circle: {
    base: "/child-login/shapes/star.svg",
    selected: "/child-login/shapes-selected/star.svg",
  },
  square: {
    base: "/child-login/shapes/heart.svg",
    selected: "/child-login/shapes-selected/heart.svg",
  },
  triangle: {
    base: "/child-login/shapes/spiral.svg",
    selected: "/child-login/shapes-selected/spiral.svg",
  },
  diamond: {
    base: "/child-login/shapes/diamond.svg",
    selected: "/child-login/shapes-selected/diamond.svg",
  },
  star: {
    base: "/child-login/shapes/flower.svg",
    selected: "/child-login/shapes-selected/flower.svg",
  },
  heart: {
    base: "/child-login/shapes/cloud.svg",
    selected: "/child-login/shapes-selected/cloud.svg",
  },
  club: {
    base: "/child-login/shapes/moon.svg",
    selected: "/child-login/shapes-selected/moon.svg",
  },
  spade: {
    base: "/child-login/shapes/burst.svg",
    selected: "/child-login/shapes-selected/burst.svg",
  },
  sun: {
    base: "/child-login/shapes/octagon.svg",
    selected: "/child-login/shapes-selected/octagon.svg",
  },
};

export default function ChildColorPicker({
  sequence,
  onAddColor,
  onClear,
  onRemoveColor,
  view = "login",
  passwordType = ChildPasswordType.COLOR,
  showInstruction = true,
}: ChildColorPickerProps) {
  const isMobileChangeView = view === "change";
  const previewTextClass = "text-black";
  const instructionTextClass = isMobileChangeView
    ? "text-left text-[24px] leading-normal text-white"
    : "text-textGrey";
  const tiles = getChildPatternTiles(passwordType);
  const instructionMap: Record<ChildPasswordType, string> = {
    [ChildPasswordType.NORMAL]: "Enter a new pin below",
    [ChildPasswordType.COLOR]: "Choose the colors for your password below",
    [ChildPasswordType.SHAPE]: "Choose the shapes for your password below",
    [ChildPasswordType.EMOJI]: "Choose the emojis for your password below",
    [ChildPasswordType.PATTERN]: "Choose the patterns for your password below",
  };
  const instruction = instructionMap[passwordType];
  const isShapeType = passwordType === ChildPasswordType.SHAPE;
  const isPatternType = passwordType === ChildPasswordType.PATTERN;
  const isEmojiType = passwordType === ChildPasswordType.EMOJI;
  const isVisualType = isShapeType || isPatternType;
  let tileTextClass = "text-[14px] leading-none text-black";
  if (isVisualType) {
    tileTextClass = "";
  } else if (isEmojiType) {
    tileTextClass = "text-[46px] leading-none";
  }
  const renderShapeGlyph = (
    token: string,
    preview = false,
    selected = false,
  ) => {
    const baseSize = SHAPE_SIZES[token] ?? { width: 62, height: 62 };
    const scale = preview ? 50 / 90 : 1;
    const width = baseSize.width * scale;
    const height = baseSize.height * scale;
    const shapeSources = SHAPE_IMAGE_MAP[token];
    if (!shapeSources) return null;
    const src = selected ? shapeSources.selected : shapeSources.base;

    return (
      <Image
        src={src}
        alt={token}
        width={width}
        height={height}
        className="select-none pointer-events-none"
      />
    );
  };
  const getTileDisplayValue = (token: string) => {
    const tileIndex = tiles.findIndex((item) => item.token === token);
    if (tileIndex === -1) {
      return "";
    }
    if (passwordType === ChildPasswordType.SHAPE) {
      return renderShapeGlyph(token, true, true);
    }
    if (passwordType === ChildPasswordType.PATTERN) {
      const file = PATTERN_IMAGE_MAP[token];
      if (!file) return "";
      return (
        <Image
          src={`/child-login/patterns-blue/${file}`}
          alt={token}
          width={36}
          height={36}
          className="select-none pointer-events-none"
        />
      );
    }
    if (passwordType === ChildPasswordType.EMOJI) {
      return tiles[tileIndex].content || "";
    }
    return tiles[tileIndex].content || tileIndex + 1;
  };

  const getTileContent = (
    token: string,
    content: string | undefined,
    fallbackIndex: number,
    selected: boolean,
  ) => {
    if (isShapeType) {
      return (
        <span className="relative z-10" style={{ lineHeight: 0 }}>
          {renderShapeGlyph(token, false, selected)}
        </span>
      );
    }

    if (isPatternType) {
      const patternFile = PATTERN_IMAGE_MAP[token];
      if (!patternFile) return null;
      // Match shape tiles: inactive → #000 (login: brightness-0 on patterns-blue); active → #2C3694
      // (patterns-blue / icanBlue-300). Change view: patterns-white → patterns-blue like white → selected shape.
      const patternDir =
        view === "change"
          ? selected
            ? "patterns-blue"
            : "patterns-white"
          : "patterns-blue";
      const patternInactiveClass =
        view === "login" && !selected ? "brightness-0" : "";

      return (
        <span
          className="absolute inset-0 z-10 overflow-hidden rounded-[4px]"
          style={{ lineHeight: 0 }}
        >
          <Image
            src={`/child-login/${patternDir}/${patternFile}`}
            alt={token}
            fill
            className={`select-none pointer-events-none object-cover ${patternInactiveClass}`}
          />
        </span>
      );
    }

    if (isEmojiType) return content;
    return content || fallbackIndex + 1;
  };
  const handleTileSelect = (token: string) => {
    if (sequence.includes(token)) {
      onRemoveColor?.(token);
      return;
    }

    if (sequence.length >= 4) {
      return;
    }
    onAddColor(token);
  };
  const hasSequence = sequence.length > 0;
  const clearActiveTextClass = view === "change" ? "text-white" : "text-black";
  const clearActiveIconClass =
    view === "change" ? "bg-white text-icanBlue-300" : "bg-black text-white";
  const tileSizeClass = isMobileChangeView ? "size-20" : "size-[90px]";
  const previewSizeClass = isMobileChangeView ? "size-[45px]" : "size-[50px]";

  return (
    <div className="flex flex-col items-center gap-3 self-stretch">
      {showInstruction && (
        <span className={`w-full ${instructionTextClass}`}>{instruction}</span>
      )}
      <div
        className={`mx-auto grid w-fit grid-cols-3 place-items-center ${isMobileChangeView ? "gap-[10px]" : "gap-3"}`}
      >
        {tiles.map((tileOption, index) => {
          const isSelected = sequence.includes(tileOption.token);
          const tileStyle =
            isPatternType && view === "change" ? undefined : tileOption.style;
          const tileBackgroundClass =
            isPatternType && view === "change" ? "bg-icanBlue-200" : "";
          const tileBorderClass = isPatternType ? "" : SQUARE_BORDER_CLASS;
          const selectedClass = isSelected
            ? isPatternType
              ? "ring-2 ring-icanBlue-300"
              : "border-icanBlue-300 ring-1 ring-icanBlue-300"
            : "";
          return (
            <button
              key={tileOption.token}
              type="button"
              aria-label={tileOption.label}
              className={`group relative ${tileSizeClass} rounded-[4px] ${tileBorderClass} ${tileBackgroundClass} flex items-center justify-center ${tileTextClass} ${selectedClass}`}
              onClick={() => handleTileSelect(tileOption.token)}
              style={tileStyle}
            >
              {isSelected && isVisualType && (
                <span
                  className={`pointer-events-none absolute inset-0 z-0 rounded-[4px] bg-icanBlue-100 opacity-70`}
                />
              )}
              {getTileContent(
                tileOption.token,
                tileOption.content,
                index,
                isSelected,
              )}
              {isSelected && isPatternType && (
                <span className="pointer-events-none absolute inset-0 z-20 rounded-[4px] ring-2 ring-inset ring-icanBlue-300" />
              )}
              {isSelected && !isMobileChangeView && (
                <span className="pointer-events-none absolute left-2 top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-icanBlue-300 text-[12px] leading-none text-white">
                  ✓
                </span>
              )}
              <span
                className={`pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-75 ${isMobileChangeView ? "hidden" : "group-hover:opacity-100"}`}
              >
                {tileOption.label}
              </span>
            </button>
          );
        })}
      </div>
      <div
        className={`flex items-center justify-center ${isMobileChangeView ? "mt-4 gap-3" : "mt-2 gap-3"}`}
      >
        {Array.from({ length: 4 }, (_, index) => {
          const token = sequence[index];
          const option = token
            ? tiles.find((item) => item.token === token)
            : undefined;
          const previewStyle = option?.style;
          const previewContentClass =
            passwordType === ChildPasswordType.EMOJI
              ? "text-[30px] leading-none"
              : "text-xl";
          return (
            <div
              key={`${token ?? "empty"}-${index}`}
              title={option?.label || "Empty"}
              className={`${previewSizeClass} rounded-[4px] bg-tilePreviewBg ${SQUARE_BORDER_CLASS} ${previewTextClass} flex items-center justify-center ${previewContentClass}`}
              style={previewStyle}
            >
              {token ? getTileDisplayValue(token) : ""}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={`flex items-center gap-2 tracking-[-0.04em] disabled:opacity-70 ${isMobileChangeView ? "mt-3 text-[14px]/[14px]" : "mt-1 text-[16px]/[16px]"} ${hasSequence ? clearActiveTextClass : "text-loginDisabledBg"}`}
        onClick={onClear}
        disabled={sequence.length === 0}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${hasSequence ? clearActiveIconClass : "bg-loginDisabledBg text-white"}`}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-3 w-3 shrink-0"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M5 5l10 10M15 5l-10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Clear Password</span>
      </button>
    </div>
  );
}

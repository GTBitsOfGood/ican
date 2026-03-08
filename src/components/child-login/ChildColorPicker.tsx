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

const CHANGE_POPUP_BLUE = "#4C539B";
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
  const previewTextClass = "text-black";
  const instructionTextClass =
    view === "change" ? "text-white/80" : "text-textGrey";
  const tiles = getChildPatternTiles(passwordType);
  const instructionMap: Record<ChildPasswordType, string> = {
    [ChildPasswordType.NORMAL]: "Tap colors in order",
    [ChildPasswordType.COLOR]: "Tap colors in order",
    [ChildPasswordType.SHAPE]: "Tap shapes in order",
    [ChildPasswordType.EMOJI]: "Tap emojis in order",
    [ChildPasswordType.PATTERN]: "Tap patterns in order",
  };
  const instruction = instructionMap[passwordType];
  const isShapeType = passwordType === ChildPasswordType.SHAPE;
  const isPatternType = passwordType === ChildPasswordType.PATTERN;
  const isEmojiType = passwordType === ChildPasswordType.EMOJI;
  const isVisualType = isShapeType || isPatternType;
  const tileTextClass =
    isVisualType || !isEmojiType
      ? isVisualType
        ? ""
        : "text-[14px] leading-none text-black"
      : "text-[46px] leading-none";
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
    patternDir: string,
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
      return patternFile ? (
        <span
          className="absolute inset-0 z-10 overflow-hidden rounded-[4px]"
          style={{ lineHeight: 0 }}
        >
          <Image
            src={`/child-login/${patternDir}/${patternFile}`}
            alt={token}
            fill
            className="select-none pointer-events-none object-cover"
          />
        </span>
      ) : null;
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
    view === "change" ? "bg-white text-[#2C3694]" : "bg-black text-white";

  return (
    <div className="flex flex-col items-center gap-3">
      {showInstruction && (
        <span className={`text-sm self-start ${instructionTextClass}`}>
          {instruction}
        </span>
      )}
      <div className="grid grid-cols-3 gap-3 w-fit mx-auto place-items-center">
        {tiles.map((tileOption, index) => {
          const isSelected = sequence.includes(tileOption.token);
          const patternDir =
            view === "change" ? "patterns-white" : "patterns-blue";
          const tileStyle =
            isPatternType && view === "change"
              ? { ...tileOption.style, backgroundColor: CHANGE_POPUP_BLUE }
              : tileOption.style;
          const tileBorderClass = isPatternType ? "" : SQUARE_BORDER_CLASS;
          const selectedClass =
            isSelected && !isPatternType
              ? "border-[#2C3694] ring-1 ring-[#2C3694]"
              : "";
          return (
            <button
              key={tileOption.token}
              type="button"
              aria-label={tileOption.label}
              className={`group relative size-[90px] rounded-[4px] ${tileBorderClass} flex items-center justify-center ${tileTextClass} ${selectedClass}`}
              onClick={() => handleTileSelect(tileOption.token)}
              style={tileStyle}
            >
              {isSelected && isVisualType && (
                <span className="absolute inset-0 z-0 rounded-[4px] bg-[#B7BDEF] opacity-70" />
              )}
              {getTileContent(
                tileOption.token,
                tileOption.content,
                index,
                isSelected,
                patternDir,
              )}
              {isSelected && !isVisualType && (
                <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#2C3694] text-[12px] leading-none text-white">
                  ✓
                </span>
              )}
              <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-black px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity duration-75 group-hover:opacity-100">
                {tileOption.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
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
              className={`size-[50px] rounded-[4px] bg-[#FBF8F8] ${SQUARE_BORDER_CLASS} ${previewTextClass} flex items-center justify-center ${previewContentClass}`}
              style={previewStyle}
            >
              {token ? getTileDisplayValue(token) : ""}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={`mt-1 flex items-center gap-2 text-[16px]/[16px] tracking-[-0.04em] ${hasSequence ? clearActiveTextClass : "text-[#C6C6C6]"} disabled:opacity-70`}
        onClick={onClear}
        disabled={sequence.length === 0}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none ${hasSequence ? clearActiveIconClass : "bg-[#C6C6C6] text-white"}`}
        >
          ×
        </span>
        <span>Clear Password</span>
      </button>
    </div>
  );
}

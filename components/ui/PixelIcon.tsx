import { cn } from "@/lib/utils";

const iconMaps = {
  crown: [
    "00100100",
    "01111110",
    "11111111",
    "11011011",
    "11111111",
    "01111110",
    "01111110",
    "00000000",
  ],
  sword: [
    "00010000",
    "00111000",
    "00010000",
    "00010000",
    "00010000",
    "00111000",
    "00111000",
    "00101000",
  ],
  ward: [
    "00011000",
    "00111100",
    "01111110",
    "00111100",
    "00011000",
    "00111100",
    "00111100",
    "00011000",
  ],
  rune: [
    "00011000",
    "00111100",
    "01111110",
    "11111111",
    "01111110",
    "00111100",
    "00011000",
    "00000000",
  ],
} as const;

interface PixelIconProps {
  icon: keyof typeof iconMaps;
  className?: string;
  cellClassName?: string;
  size?: number;
}

export function PixelIcon({
  icon,
  className,
  cellClassName,
  size = 4,
}: PixelIconProps) {
  const map = iconMaps[icon];

  return (
    <span
      className={cn("inline-grid shrink-0 gap-px align-middle [image-rendering:pixelated]", className)}
      style={{ gridTemplateColumns: `repeat(8, ${size}px)` }}
      aria-hidden="true"
    >
      {map.flatMap((row, rowIndex) =>
        row.split("").map((cell, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={cn(
              "block bg-current",
              cell === "1" ? "opacity-100" : "opacity-0",
              cellClassName,
            )}
            style={{ width: size, height: size }}
          />
        )),
      )}
    </span>
  );
}

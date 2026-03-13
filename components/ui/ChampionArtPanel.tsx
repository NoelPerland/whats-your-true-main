import { getChampionLoadingUrl, getChampionSplashUrl, getChampionSquareUrl } from "@/lib/riotAssets";
import type { Champion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PixelIcon } from "@/components/ui/PixelIcon";

interface ChampionArtPanelProps {
  champion: Champion;
  title?: string;
  subtitle?: string;
  mode?: "loading" | "splash";
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}

export function ChampionArtPanel({
  champion,
  title,
  subtitle,
  mode = "loading",
  className,
  imageClassName,
  compact = false,
}: ChampionArtPanelProps) {
  const artUrl =
    mode === "splash"
      ? getChampionSplashUrl(champion.riotId)
      : getChampionLoadingUrl(champion.riotId);

  return (
    <div className={cn("ui-bevel ui-scanlines relative overflow-hidden border-2 border-gold-300/20 bg-black", className)}>
      <img
        src={artUrl}
        alt={champion.name}
        className={cn(
          "absolute inset-0 h-full w-full object-cover opacity-90",
          imageClassName,
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,9,0.12),rgba(2,4,9,0.86))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,9,0.68),transparent_45%,rgba(2,4,9,0.3))]" />
      <div className="absolute inset-[1px] border border-white/8 [clip-path:inherit]" />
      <div className="absolute left-4 top-4">
        <span className="ui-pixel-chip">
          <PixelIcon icon="rune" size={3} />
          {champion.roles.join(" / ")}
        </span>
      </div>
      <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border border-gold-300/24 bg-black/40">
        <img
          src={getChampionSquareUrl(champion.riotId)}
          alt={`${champion.name} icon`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className={cn("relative z-10 flex h-full flex-col justify-end p-4", compact ? "min-h-[14rem]" : "min-h-[20rem]")}>
        <p className="ui-pixel-label text-gold-300/80">
          {title ?? champion.roles.join(" / ")}
        </p>
        <p className="mt-2 font-display text-3xl leading-none text-white">
          {champion.name}
        </p>
        {subtitle ? (
          <p className="mt-3 max-w-xs text-base leading-6 text-slate-100">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

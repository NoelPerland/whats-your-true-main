import type { Archetype, Champion } from "@/lib/types";
import { getChampionLoadingUrl } from "@/lib/riotAssets";
import { PixelIcon } from "@/components/ui/PixelIcon";

interface ArchetypePreviewCardProps {
  archetype: Archetype;
  championNames: Record<string, string>;
  featuredChampion: Champion;
  index: number;
}

export function ArchetypePreviewCard({
  archetype,
  championNames,
  featuredChampion,
  index,
}: ArchetypePreviewCardProps) {
  return (
    <article className="ui-bevel ui-chrome ui-scanlines group relative overflow-hidden transition duration-200 hover:-translate-y-1">
      <div className="relative h-64 border-b-2 border-gold-300/20">
        <img
          src={getChampionLoadingUrl(featuredChampion.riotId)}
          alt={featuredChampion.name}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,12,0.12),rgba(3,6,12,0.9))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,12,0.72),transparent_52%,rgba(3,6,12,0.22))]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="ui-eyebrow">Archetype 0{index + 1}</p>
              <p className="mt-3 max-w-[14rem] font-display text-4xl leading-none text-white">
                {archetype.title}
              </p>
            </div>
            <span className="ui-pixel-chip">
              <PixelIcon icon="ward" size={3} />
              {featuredChampion.name}
            </span>
          </div>

          <p className="max-w-sm text-lg leading-7 text-slate-100">
            {archetype.subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-5 p-6">
        <p className="text-lg leading-8 text-slate-200">
          {archetype.description}
        </p>

        <p className="text-base leading-7 text-gold-300/86">
          {archetype.roastPool[0]}
        </p>

        <div className="flex flex-wrap gap-2">
          {archetype.championPool.slice(0, 4).map((champion) => (
            <span
              key={champion}
              className="ui-bevel border-2 border-gold-300/18 bg-black/25 px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-100"
            >
              {championNames[champion] ?? champion}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

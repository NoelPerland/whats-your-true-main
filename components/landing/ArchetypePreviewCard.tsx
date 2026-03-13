import type { Archetype } from "@/lib/types";

interface ArchetypePreviewCardProps {
  archetype: Archetype;
  championNames: Record<string, string>;
  index: number;
}

export function ArchetypePreviewCard({
  archetype,
  championNames,
  index,
}: ArchetypePreviewCardProps) {
  return (
    <article className="group ui-bevel ui-chrome ui-noise relative flex min-h-[26rem] flex-col justify-between p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-300/32 hover:shadow-[0_32px_90px_rgba(0,0,0,0.72)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,181,94,0.12),transparent_32%),radial-gradient(circle_at_bottom,rgba(50,91,149,0.18),transparent_36%)] opacity-80 transition duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-y-6 right-6 w-px bg-[linear-gradient(180deg,transparent,rgba(242,220,141,0.3),transparent)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="ui-eyebrow">Archetype 0{index + 1}</p>
            <p className="mt-3 max-w-[16rem] font-display text-4xl leading-none text-white">
              {archetype.title}
            </p>
          </div>
          <div className="rounded-full border border-gold-300/20 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-gold-300/78">
            Tribunal
          </div>
        </div>

        <div className="mt-8">
          <div className="ui-divider" />
        </div>

        <p className="mt-8 max-w-sm text-base leading-7 text-slate-200">
          {archetype.description}
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        <div>
          <p className="ui-eyebrow">Queue energy</p>
          <p className="mt-3 text-sm italic leading-7 text-gold-300/80">
            {archetype.roastPool[0]}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {archetype.championPool.slice(0, 4).map((champion) => (
            <span
              key={champion}
              className="ui-bevel border border-gold-300/18 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-slate-100"
            >
              {championNames[champion] ?? champion}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

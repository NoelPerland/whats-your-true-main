"use client";

import type { RefObject } from "react";

import { getChampionSquareUrl, getChampionSplashUrl } from "@/lib/riotAssets";
import type { QuizOutcome } from "@/lib/types";
import { PixelIcon } from "@/components/ui/PixelIcon";

interface ResultShareCardProps {
  cardRef: RefObject<HTMLDivElement | null>;
  outcome: QuizOutcome;
  roastLine: string;
}

export function ResultShareCard({
  cardRef,
  outcome,
  roastLine,
}: ResultShareCardProps) {
  return (
    <div
      ref={cardRef}
      className="ui-bevel ui-scanlines relative min-h-[430px] overflow-hidden border-2 border-gold-300/30 bg-[linear-gradient(180deg,rgba(8,16,30,0.98),rgba(4,8,17,1))] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.58)] sm:p-10"
    >
      <img
        src={getChampionSplashUrl(outcome.primaryChampion.riotId)}
        alt={outcome.primaryChampion.name}
        className="absolute inset-0 h-full w-full object-cover object-center opacity-28"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.92),rgba(2,4,10,0.55)_55%,rgba(2,4,10,0.78))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.2),rgba(2,4,10,0.92))]" />
      <div className="absolute inset-[1px] border border-white/8 [clip-path:inherit]" />
      <div className="absolute inset-y-8 left-8 w-px bg-[linear-gradient(180deg,transparent,rgba(242,220,141,0.6),transparent)]" />
      <div className="absolute inset-y-8 right-8 w-px bg-[linear-gradient(180deg,transparent,rgba(242,220,141,0.35),transparent)]" />

      <div className="relative z-10 grid min-h-[340px] gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="ui-eyebrow">What&apos;s Your True Main?</p>
                <h3 className="mt-4 max-w-xl font-display text-5xl leading-[0.9] text-white">
                  {outcome.archetype.title}
                </h3>
              </div>
              <span className="ui-pixel-chip">
                <PixelIcon icon="crown" size={3} />
                Result
              </span>
            </div>

            <p className="max-w-2xl text-xl leading-8 text-gold-300/90">
              {outcome.archetype.subtitle}
            </p>
          </div>

          <div className="space-y-5">
            <div className="ui-divider" />
            <p className="max-w-2xl text-2xl leading-9 text-slate-100">
              {roastLine}
            </p>
            <div className="flex flex-wrap gap-2">
              {outcome.dominantTraits.slice(0, 3).map((trait) => (
                <span
                  key={trait}
                  className="ui-bevel border-2 border-gold-300/20 bg-black/28 px-3 py-2 text-sm font-semibold uppercase tracking-[0.06em] text-slate-100"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ui-bevel relative border-2 border-gold-300/20 bg-[linear-gradient(180deg,rgba(217,181,94,0.16),rgba(5,8,15,0.84))] p-5">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="ui-eyebrow">True Main</p>
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={getChampionSquareUrl(outcome.primaryChampion.riotId)}
                  alt={`${outcome.primaryChampion.name} icon`}
                  className="h-16 w-16 rounded-md border-2 border-gold-300/24"
                />
                <p className="font-display text-5xl leading-none text-white">
                  {outcome.primaryChampion.name}
                </p>
              </div>
            </div>

            <div className="ui-bevel border-2 border-white/10 bg-black/24 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.06em] text-gold-300/82">
                Role Profile
              </p>
              <p className="mt-3 text-lg font-semibold uppercase tracking-[0.06em] text-slate-100">
                {outcome.primaryChampion.roles.join(" / ")}
              </p>
              <p className="mt-3 text-lg leading-6 text-slate-200">
                {outcome.primaryChampion.fantasy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

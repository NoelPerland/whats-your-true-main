"use client";

import type { RefObject } from "react";

import type { QuizOutcome } from "@/lib/types";

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
      className="ui-bevel relative min-h-[420px] overflow-hidden border border-gold-300/30 bg-[linear-gradient(180deg,rgba(8,16,30,0.98),rgba(4,8,17,1))] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.58)] sm:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,181,94,0.16),transparent_36%),radial-gradient(circle_at_80%_30%,rgba(41,92,157,0.22),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_26%,transparent_74%,rgba(255,255,255,0.02))]" />
      <div className="absolute inset-0 ui-panel-grid opacity-[0.08]" />
      <div className="absolute inset-[1px] border border-white/8 [clip-path:inherit]" />
      <div className="absolute left-10 top-10 h-28 w-px bg-[linear-gradient(180deg,rgba(242,220,141,0.8),transparent)]" />
      <div className="absolute right-10 top-10 h-28 w-px bg-[linear-gradient(180deg,rgba(242,220,141,0.45),transparent)]" />
      <div className="relative z-10 grid min-h-[340px] gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="ui-eyebrow">What&apos;s Your True Main?</p>
                <h3 className="mt-4 max-w-xl font-display text-5xl leading-[0.9] text-white">
                  {outcome.archetype.title}
                </h3>
              </div>
              <div className="ui-bevel border border-gold-300/18 bg-black/24 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-gold-300/82">
                Tribunal Verdict
              </div>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-gold-300/84">
              {outcome.archetype.subtitle}
            </p>
          </div>

          <div className="space-y-5">
            <div className="ui-divider" />
            <p className="max-w-2xl text-xl leading-9 text-slate-100">
              {roastLine}
            </p>
            <div className="flex flex-wrap gap-2">
              {outcome.dominantTraits.slice(0, 3).map((trait) => (
                <span
                  key={trait}
                  className="ui-bevel border border-gold-300/20 bg-black/24 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-slate-100"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ui-bevel relative border border-gold-300/20 bg-[linear-gradient(180deg,rgba(217,181,94,0.12),rgba(5,8,15,0.72))] p-5">
          <div className="absolute inset-x-8 top-8 h-36 rounded-full bg-[radial-gradient(circle,rgba(217,181,94,0.25),transparent_68%)] blur-2xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="ui-eyebrow">True Main</p>
              <p className="mt-4 font-display text-5xl leading-none text-white">
                {outcome.primaryChampion.name}
              </p>
            </div>
            <div className="ui-bevel border border-white/8 bg-black/24 p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-300/78">
                Role Profile
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-100">
                {outcome.primaryChampion.roles.join(" / ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

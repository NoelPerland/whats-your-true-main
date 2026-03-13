import Link from "next/link";

import { ArchetypePreviewCard } from "@/components/landing/ArchetypePreviewCard";
import { buttonClasses } from "@/components/ui/ActionButton";
import { ChampionArtPanel } from "@/components/ui/ChampionArtPanel";
import { CinematicBackdrop } from "@/components/ui/CinematicBackdrop";
import { GoldCard } from "@/components/ui/GoldCard";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { archetypes } from "@/data/archetypes";
import { champions } from "@/data/champions";
import type { Champion } from "@/lib/types";

const previewArchetypes = archetypes.slice(0, 3);
const featuredChampions = ["yasuo", "jinx", "thresh"]
  .map((slug) => champions.find((champion) => champion.slug === slug))
  .filter((champion): champion is Champion => champion !== undefined);
const fallbackChampion = champions.find((champion) => champion.slug === "yasuo");

if (!fallbackChampion) {
  throw new Error("Missing fallback champion for landing page.");
}

const primaryFeaturedChampion: Champion = featuredChampions[0] ?? fallbackChampion;

const championNames = Object.fromEntries(
  champions.map((champion) => [champion.slug, champion.name]),
);
const championLookup: Record<string, Champion> = Object.fromEntries(
  champions.map((champion) => [champion.slug, champion]),
);

function getArchetypePreviewChampion(slug: string | undefined): Champion {
  if (slug) {
    const champion = championLookup[slug];

    if (champion) {
      return champion;
    }
  }

  return primaryFeaturedChampion;
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <CinematicBackdrop variant="landing" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-20 pt-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="ui-eyebrow">
              League-Inspired Personality Tribunal
            </p>
            <p className="mt-2 font-display text-2xl text-white">
              What&apos;s Your True Main?
            </p>
          </div>
          <div className="ui-bevel hidden border border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-300 sm:block">
            10 Questions. 6 Archetypes. 24 Champions.
          </div>
        </header>

        <section className="relative flex-1 py-16 lg:py-24">
          <GoldCard className="relative px-7 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px]">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="ui-eyebrow">Summoner Profile Reading</p>
                  <span className="ui-pixel-chip">
                    <PixelIcon icon="crown" size={3} />
                    Solo Queue Lore
                  </span>
                </div>
                <p className="mt-6 max-w-[12ch] font-display text-[4.1rem] leading-[0.86] text-white sm:text-[5.6rem] lg:text-[6.2rem]">
                  Your mechanics say one thing.
                </p>
                <p className="mt-4 max-w-[10ch] font-display text-[3.2rem] leading-[0.9] text-gold-300 sm:text-[4.3rem] lg:text-[4.9rem]">
                  Your ego says another.
                </p>
                <p className="mt-4 max-w-[11ch] font-display text-[2.5rem] leading-[0.94] text-slate-100 sm:text-[3.1rem] lg:text-[3.55rem]">
                  Let&apos;s determine your true main.
                </p>
                <p className="mt-8 max-w-xl text-xl leading-8 text-slate-100">
                  Ten questions. One main. Vision score not included.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/quiz" className={buttonClasses()}>
                    Start the Quiz
                  </Link>
                  <a href="#archetypes" className={buttonClasses("secondary")}>
                    See Archetypes
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="ui-pixel-chip">
                    <PixelIcon icon="sword" size={3} />
                    Main Character Bias
                  </span>
                  <span className="ui-pixel-chip">
                    <PixelIcon icon="ward" size={3} />
                    Map Awareness Alleged
                  </span>
                  <span className="ui-pixel-chip">
                    <PixelIcon icon="rune" size={3} />
                    Rune Page Energy
                  </span>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["10", "Questions", "Fast reads. No filler."],
                    ["24", "Champions", "Real League art throughout."],
                    ["01", "Verdict", "A single main with backup picks."],
                  ].map(([value, label, copy]) => (
                    <div
                      key={label}
                      className="ui-bevel border-2 border-white/10 bg-black/24 px-4 py-4"
                    >
                      <p className="font-display text-4xl text-gold-300">{value}</p>
                      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-100">
                        {label}
                      </p>
                      <p className="mt-2 text-lg leading-6 text-slate-300">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {featuredChampions.map((champion, index) => (
                  <ChampionArtPanel
                    key={champion.slug}
                    champion={champion}
                    title={index === 0 ? "Featured Verdict Style" : "Possible Main Energy"}
                    subtitle={index === 0 ? "Built with official League champion art." : undefined}
                    compact
                    className="min-h-[13.5rem]"
                  />
                ))}
              </div>
            </div>
          </GoldCard>
        </section>

        <section id="archetypes" className="space-y-8">
          <div className="max-w-2xl">
            <p className="ui-eyebrow">
              Archetype Deck
            </p>
            <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
              Preview the cards before the reading starts.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              Not personality types. More like recurring queue crimes, now with
              champion cards and way too much confidence.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {previewArchetypes.map((archetype, index) => (
              <ArchetypePreviewCard
                key={archetype.key}
                archetype={archetype}
                championNames={championNames}
                featuredChampion={getArchetypePreviewChampion(archetype.championPool[0])}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

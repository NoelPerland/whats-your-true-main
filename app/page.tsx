import Link from "next/link";

import { ArchetypePreviewCard } from "@/components/landing/ArchetypePreviewCard";
import { buttonClasses } from "@/components/ui/ActionButton";
import { CinematicBackdrop } from "@/components/ui/CinematicBackdrop";
import { GoldCard } from "@/components/ui/GoldCard";
import { archetypes } from "@/data/archetypes";
import { champions } from "@/data/champions";

const previewArchetypes = archetypes.slice(0, 3);
const championNames = Object.fromEntries(
  champions.map((champion) => [champion.slug, champion.name]),
);

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
          <GoldCard className="relative overflow-visible px-7 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="pointer-events-none absolute inset-y-14 left-10 w-px bg-[linear-gradient(180deg,transparent,rgba(242,220,141,0.45),transparent)]" />
            <div className="pointer-events-none absolute right-[11%] top-12 h-72 w-72 rounded-full border border-gold-300/15 opacity-90" />
            <div className="pointer-events-none absolute right-[11%] top-12 h-72 w-72 animate-sigil rounded-full border border-gold-300/10" />
            <div className="pointer-events-none absolute right-[13.5%] top-[4.75rem] h-60 w-60 rounded-full border border-white/6" />
            <div className="pointer-events-none absolute right-[18%] top-[9rem] h-32 w-32 rotate-45 border border-gold-300/20 bg-gold-300/5 shadow-aura" />
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_380px]">
              <div className="max-w-4xl">
                <p className="ui-eyebrow">Summoner Profile Reading</p>
                <p className="mt-6 max-w-[13ch] font-display text-[3.8rem] leading-[0.86] text-white sm:text-[5.35rem] lg:text-[6.4rem]">
                  Your mechanics say one thing.
                </p>
                <p className="mt-5 max-w-[12ch] font-display text-[2.7rem] leading-[0.9] text-gold-300 sm:text-[4.1rem] lg:text-[4.8rem]">
                  Your ego says another.
                </p>
                <p className="mt-4 max-w-[13ch] font-display text-[2.2rem] leading-[0.92] text-slate-200 sm:text-[3rem] lg:text-[3.6rem]">
                  Let&apos;s determine your true main.
                </p>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  Ten sharp questions. One expensive-looking verdict. Just enough
                  psychological damage to feel honest.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/quiz" className={buttonClasses()}>
                    Enter the Tribunal
                  </Link>
                  <a href="#archetypes" className={buttonClasses("secondary")}>
                    View the Cards
                  </a>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["01", "Curated archetypes", "Built for the exact kind of player who says 'trust me' before disaster."],
                    ["02", "Champion verdict", "A primary main, backup pool, and enough false certainty to feel official."],
                    ["03", "Shareable damage", "Export a reveal card worthy of Discord, cope, and public overconfidence."],
                  ].map(([value, label, copy]) => (
                    <div
                      key={label}
                      className="ui-bevel border border-white/8 bg-black/24 px-4 py-4"
                    >
                      <p className="font-display text-3xl text-gold-300">{value}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-slate-100">
                        {label}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="ui-bevel ui-chrome relative p-7">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,181,94,0.16),transparent_36%)]" />
                  <p className="ui-eyebrow relative z-10">Reading Preview</p>
                  <div className="relative z-10 mt-8 flex justify-center">
                    <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-gold-300/20 bg-[radial-gradient(circle,rgba(11,20,38,0.72),rgba(4,8,17,0.98))]">
                      <div className="absolute inset-5 rounded-full border border-gold-300/12" />
                      <div className="absolute inset-10 rounded-full border border-white/6" />
                      <div className="absolute h-44 w-44 rotate-45 border border-gold-300/18 bg-gold-300/5 shadow-[0_0_40px_rgba(217,181,94,0.12)]" />
                      <div className="relative text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold-300/72">
                          Verdict
                        </p>
                        <p className="mt-4 font-display text-6xl leading-none text-white">
                          Main
                        </p>
                        <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-300">
                          Revealed at the end
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 mt-8 space-y-4">
                    {[
                      "Ego density",
                      "Greed index",
                      "Map awareness",
                    ].map((label, index) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-slate-300">
                          <span>{label}</span>
                          <span className="text-gold-300">{["volatile", "elevated", "alleged"][index]}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#5F4720,#D9B55E,#F2DC8D)]"
                            style={{ width: `${[82, 66, 34][index]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              Not personality types. More like recurring queue crimes with art
              direction.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {previewArchetypes.map((archetype, index) => (
              <ArchetypePreviewCard
                key={archetype.key}
                archetype={archetype}
                championNames={championNames}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

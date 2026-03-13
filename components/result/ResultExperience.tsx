"use client";

import { AnimatePresence, motion } from "framer-motion";
import { toPng } from "html-to-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ResultShareCard } from "@/components/result/ResultShareCard";
import { ActionButton, buttonClasses } from "@/components/ui/ActionButton";
import { GoldCard } from "@/components/ui/GoldCard";
import { clearQuizOutcome, loadQuizOutcome } from "@/lib/result";
import type { QuizOutcome } from "@/lib/types";
import { cn } from "@/lib/utils";

const revealTimings = [180, 620, 1120, 1480];

export function ResultExperience() {
  const router = useRouter();
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const [roastIndex, setRoastIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [revealStage, setRevealStage] = useState(0);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedOutcome = loadQuizOutcome();
    setOutcome(storedOutcome);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!outcome) {
      return;
    }

    setRevealStage(0);

    const timeouts = revealTimings.map((delay, index) =>
      window.setTimeout(() => {
        setRevealStage(index + 1);
      }, delay),
    );

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [outcome]);

  if (!isReady) {
    return (
      <GoldCard className="mx-auto max-w-3xl p-8 text-center">
        <p className="ui-eyebrow">Summoning Result</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          Forging your verdict.
        </h1>
      </GoldCard>
    );
  }

  if (!outcome) {
    return (
      <GoldCard className="mx-auto max-w-3xl p-8 text-center">
        <p className="ui-eyebrow">No Stored Verdict</p>
        <h1 className="mt-4 font-display text-4xl text-white">
          The tribunal needs a fresh reading.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          There is no saved result in session storage yet, so there is nothing
          ceremonial to reveal.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/quiz" className={buttonClasses()}>
            Start the Quiz
          </Link>
        </div>
      </GoldCard>
    );
  }

  const outcomeData = outcome;
  const roastLine =
    outcomeData.archetype.roastPool[
      roastIndex % outcomeData.archetype.roastPool.length
    ] ?? outcomeData.roastLine;

  async function handleShareCardExport() {
    if (!shareCardRef.current || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${outcomeData.primaryChampion.slug}-true-main.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }

  function handleRetake() {
    clearQuizOutcome();
    router.push("/quiz");
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_440px]">
        <GoldCard className="overflow-visible px-8 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute left-8 top-8 h-24 w-px bg-[linear-gradient(180deg,rgba(242,220,141,0.58),transparent)]" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-32 w-32 rotate-45 border border-gold-300/12 bg-gold-300/5" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={
              revealStage >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <p className="ui-eyebrow">Tribunal Verdict</p>
            <div className="max-w-4xl space-y-4">
              <h1 className="font-display text-5xl leading-[0.92] text-white sm:text-7xl">
                {outcomeData.archetype.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-gold-300/88">
                {outcomeData.archetype.subtitle}
              </p>
              <p className="max-w-3xl text-base leading-8 text-slate-300">
                {outcomeData.archetype.description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={
              revealStage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]"
          >
            <div className="ui-bevel border border-gold-300/16 bg-black/20 p-5">
              <p className="ui-eyebrow">Psychological Assessment</p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                {outcomeData.assessment}
              </p>
            </div>

            <div className="ui-bevel border border-gold-300/16 bg-[linear-gradient(180deg,rgba(217,181,94,0.14),rgba(4,8,17,0.5))] p-5">
              <p className="ui-eyebrow">Dominant Traits</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {outcomeData.dominantTraits.map((trait) => (
                  <span
                    key={trait}
                    className="ui-bevel border border-gold-300/20 bg-black/28 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-white"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </GoldCard>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={
            revealStage >= 2
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.88, y: 20 }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <GoldCard className="relative overflow-visible p-8 text-center">
            <div className="pointer-events-none absolute inset-x-10 top-8 h-56 rounded-full bg-[radial-gradient(circle,rgba(217,181,94,0.24),transparent_64%)] blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-6 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-gold-300/12" />
            <div className="pointer-events-none absolute left-1/2 top-10 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full border border-white/6" />
            <div className="pointer-events-none absolute left-1/2 top-[5.25rem] h-40 w-40 -translate-x-1/2 rotate-45 border border-gold-300/18 bg-gold-300/6 shadow-[0_0_50px_rgba(217,181,94,0.12)]" />

            <div className="relative z-10">
              <p className="ui-eyebrow">This Is Your Main</p>
              <div className="mt-8 flex justify-center">
                <div className="flex h-72 w-72 items-center justify-center rounded-full border border-gold-300/24 bg-[radial-gradient(circle_at_top,rgba(217,181,94,0.18),rgba(9,18,35,0.92))] shadow-[0_0_52px_rgba(217,181,94,0.16)]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.42em] text-gold-300/72">
                      Verdict
                    </p>
                    <p className="mt-4 font-display text-6xl leading-none text-white">
                      {outcomeData.primaryChampion.name}
                    </p>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                      {outcomeData.primaryChampion.roles.join(" / ")}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-[11px] uppercase tracking-[0.32em] text-gold-300/78">
                Champion profile
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-300">
                {outcomeData.primaryChampion.fantasy}
              </p>
            </div>
          </GoldCard>
        </motion.div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            revealStage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <GoldCard className="p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="ui-eyebrow">Curated Backups</p>
                <h2 className="mt-3 font-display text-3xl text-white">
                  If you need plausible deniability.
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {outcomeData.backupChampions.slice(0, 4).map((champion, index) => (
                <div
                  key={champion.slug}
                  className="ui-bevel border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(5,8,15,0.72))] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="ui-eyebrow">Backup 0{index + 1}</p>
                      <p className="mt-3 font-display text-3xl text-white">
                        {champion.name}
                      </p>
                    </div>
                    <span className="rounded-full border border-gold-300/16 bg-gold-300/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-gold-300/82">
                      {champion.roles[0]}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {champion.fantasy}
                  </p>
                </div>
              ))}
            </div>
          </GoldCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            revealStage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <GoldCard className="p-6">
            <p className="ui-eyebrow">Roast Mode</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={roastLine}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-4 text-xl leading-9 text-slate-100"
              >
                {roastLine}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-3">
              <ActionButton
                onClick={() => setRoastIndex((value) => value + 1)}
                className="flex-1"
              >
                Roast Me Harder
              </ActionButton>
              <ActionButton tone="secondary" onClick={handleRetake} className="flex-1">
                Retake Quiz
              </ActionButton>
              <ActionButton
                tone="secondary"
                onClick={handleShareCardExport}
                className="w-full"
              >
                {isExporting ? "Forging Image..." : "Save Share Card"}
              </ActionButton>
            </div>
          </GoldCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={revealStage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <GoldCard className="grid gap-8 p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <p className="ui-eyebrow">Fake Stat Profile</p>
            <h2 className="mt-3 font-display text-3xl text-white">
              Numbers with excellent posture.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Emotionally correct. Scientifically corrupt. Perfect for this
              particular kind of ceremony.
            </p>
          </div>

          <div className="space-y-5">
            {outcomeData.stats.map((stat, index) => (
              <div key={stat.key} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-300">
                  <span>{stat.label}</span>
                  <span className="font-display text-xl text-gold-300">{stat.value}</span>
                </div>
                <div className="ui-bevel h-4 overflow-hidden border border-white/6 bg-[#060b13]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: revealStage >= 3 ? `${stat.value}%` : "0%" }}
                    transition={{
                      duration: 0.72,
                      delay: 0.1 + index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "relative h-full bg-[linear-gradient(90deg,#5F4720,#B78B3C,#F2DC8D)]",
                      index === 0 && "shadow-[0_0_18px_rgba(217,181,94,0.2)]",
                    )}
                  >
                    <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)]" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </GoldCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={revealStage >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <GoldCard className="p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="ui-eyebrow">Share Card</p>
              <h2 className="mt-3 font-display text-3xl text-white">
                Export the accusation.
              </h2>
            </div>
            <ActionButton tone="secondary" onClick={handleShareCardExport}>
              {isExporting ? "Forging Image..." : "Export PNG"}
            </ActionButton>
          </div>
          <ResultShareCard
            cardRef={shareCardRef}
            outcome={outcomeData}
            roastLine={roastLine}
          />
        </GoldCard>
      </motion.div>
    </div>
  );
}

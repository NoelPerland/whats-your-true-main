"use client";

import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { QuestionStage } from "@/components/quiz/QuestionStage";
import { ActionButton } from "@/components/ui/ActionButton";
import { GoldCard } from "@/components/ui/GoldCard";
import { questions } from "@/data/questions";
import { saveQuizOutcome } from "@/lib/result";
import { buildQuizOutcome } from "@/lib/scoring";
import type { QuestionAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

const phaseLabels = [
  "Calibration",
  "Exposure",
  "Escalation",
  "Verdict",
];

export function QuizExperience() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const phaseIndex = Math.min(
    phaseLabels.length - 1,
    Math.floor((currentIndex / questions.length) * phaseLabels.length),
  );
  const phase = phaseLabels[phaseIndex];
  const tension = Math.round(((currentIndex + 1) / questions.length) * 100);

  useEffect(() => {
    return () => {
      if (advanceTimeout.current) {
        clearTimeout(advanceTimeout.current);
      }
    };
  }, []);

  function handleAnswerSelect(answerIndex: number) {
    if (isSubmitting) {
      return;
    }

    const question = questions[currentIndex];
    const answer = question?.answers[answerIndex];

    if (!question || !answer) {
      return;
    }

    const nextAnswers: QuestionAnswer[] = [...answers, answer];

    setSelectedAnswerId(answer.id);

    if (currentIndex === questions.length - 1) {
      setIsSubmitting(true);
      advanceTimeout.current = setTimeout(() => {
        const outcome = buildQuizOutcome(nextAnswers);
        saveQuizOutcome(outcome);

        startTransition(() => {
          router.push("/result");
        });
      }, 320);

      return;
    }

    advanceTimeout.current = setTimeout(() => {
      setAnswers(nextAnswers);
      setCurrentIndex((value) => value + 1);
      setSelectedAnswerId(null);
    }, 240);
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <GoldCard className="min-h-[640px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="ui-eyebrow">
              Question {currentIndex + 1} / {questions.length}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Answer fast. The reading gets meaner if you overthink it.
            </p>
          </div>
          <div className="ui-bevel hidden border border-gold-400/18 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-200 sm:block">
            {phase}
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="grid gap-4 rounded-[22px] border border-white/8 bg-black/18 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_200px]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="ui-eyebrow">Verdict calibration</span>
                <span className="text-[11px] uppercase tracking-[0.32em] text-gold-300/82">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/6 bg-[#060b13]">
                <motion.div
                  className="relative h-full rounded-full bg-[linear-gradient(90deg,#5F4720,#B78B3C,#F2DC8D)] shadow-[0_0_22px_rgba(217,181,94,0.32)]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                >
                  <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)]" />
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {phaseLabels.map((label, index) => {
                const active = index <= phaseIndex;

                return (
                  <div
                    key={label}
                    className={cn(
                      "ui-bevel flex items-center justify-center border px-2 py-3 text-center text-[10px] uppercase tracking-[0.24em]",
                      active
                        ? "border-gold-300/28 bg-gold-300/10 text-gold-200"
                        : "border-white/8 bg-white/[0.03] text-slate-500",
                    )}
                  >
                    {label.slice(0, 3)}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={cn(
                  "ui-bevel h-2 flex-1 border transition duration-300",
                  index < currentIndex
                    ? "border-gold-300/22 bg-[linear-gradient(90deg,rgba(126,90,34,0.9),rgba(242,220,141,0.9))]"
                    : index === currentIndex
                      ? "border-gold-300/32 bg-gold-300/25 shadow-aura"
                      : "border-white/6 bg-white/5",
                )}
              />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="ui-bevel border border-white/8 bg-black/20 px-4 py-3">
              <p className="ui-eyebrow">Current phase</p>
              <p className="mt-2 font-display text-2xl text-white">{phase}</p>
            </div>
            <div className="ui-bevel border border-white/8 bg-black/20 px-4 py-3">
              <p className="ui-eyebrow">Tension</p>
              <p className="mt-2 font-display text-2xl text-gold-300">{tension}</p>
            </div>
            <div className="ui-bevel border border-white/8 bg-black/20 px-4 py-3">
              <p className="ui-eyebrow">Reading style</p>
              <p className="mt-2 font-display text-2xl text-white">
                {currentIndex < 4 ? "Polite" : currentIndex < 8 ? "Personal" : "Unkind"}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <QuestionStage
            key={currentQuestion.id}
            question={currentQuestion}
            onSelect={handleAnswerSelect}
            selectedAnswerId={selectedAnswerId}
          />
        </AnimatePresence>
      </GoldCard>

      <div className="space-y-6">
        <GoldCard className="p-6">
          <p className="ui-eyebrow">
            Queue Conditions
          </p>
          <h2 className="mt-4 font-display text-2xl text-white">
            The answers are all bad in revealing ways.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            No match history. No API. Just pattern recognition, queue shame, and
            the exact tone this kind of accusation deserves.
          </p>
        </GoldCard>

        <GoldCard className="p-6">
          <p className="ui-eyebrow">
            Tribunal Notes
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <div className="ui-bevel flex items-center justify-between border border-white/8 bg-black/20 px-4 py-3">
              <span>Profile confidence</span>
              <span className="font-display text-xl text-gold-300">
                {currentIndex < 3 ? "unstable" : currentIndex < 7 ? "narrowing" : "locked"}
              </span>
            </div>
            <div className="ui-bevel flex items-center justify-between border border-white/8 bg-black/20 px-4 py-3">
              <span>Detected impulse</span>
              <span className="font-display text-xl text-gold-300">
                {currentIndex < 4 ? "contained" : currentIndex < 8 ? "spiking" : "public"}
              </span>
            </div>
            <div className="ui-bevel flex items-center justify-between border border-white/8 bg-black/20 px-4 py-3">
              <span>Chance this feels personal</span>
              <span className="font-display text-xl text-gold-300">high</span>
            </div>
          </div>
        </GoldCard>

        <ActionButton tone="secondary" onClick={() => router.push("/")}>
          Leave the Tribunal
        </ActionButton>
      </div>
    </div>
  );
}

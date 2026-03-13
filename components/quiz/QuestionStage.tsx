"use client";

import { motion } from "framer-motion";

import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionStageProps {
  question: Question;
  onSelect: (answerIndex: number) => void;
  selectedAnswerId: string | null;
}

export function QuestionStage({
  question,
  onSelect,
  selectedAnswerId,
}: QuestionStageProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 28, scale: 0.982, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, scale: 0.985, filter: "blur(4px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <p className="ui-eyebrow">
          Personality Probe
        </p>
        <h1 className="max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-[3.65rem]">
          {question.prompt}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-300">
          Pick the answer that sounds most like your queue behavior on a day you
          would insist was completely normal.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.06,
              delayChildren: 0.08,
            },
          },
        }}
        className="grid gap-4"
      >
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswerId === answer.id;

          return (
            <motion.button
              key={answer.id}
              type="button"
              onClick={() => onSelect(index)}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, scale: 1.008 }}
              whileTap={{ scale: 0.995 }}
              className={cn(
                "ui-bevel group relative overflow-hidden border px-5 py-5 text-left transition duration-300",
                isSelected
                  ? "border-gold-300/75 bg-[linear-gradient(180deg,rgba(217,181,94,0.22),rgba(49,32,11,0.46))] shadow-[0_0_28px_rgba(217,181,94,0.18)]"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(6,10,18,0.72))] hover:border-gold-400/42 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(8,12,22,0.78))]",
              )}
            >
              <span className="pointer-events-none absolute inset-[1px] border border-white/6 [clip-path:inherit]" />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,220,141,0.92),transparent)] opacity-60" />
              <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,rgba(242,220,141,0.12),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0 transition duration-300",
                  isSelected && "opacity-100",
                )}
              >
                <span className="absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]" />
              </span>
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/20 bg-black/25 font-display text-lg text-gold-300/85">
                      0{index + 1}
                    </span>
                    <p className="text-lg font-semibold text-white sm:text-xl">
                      {answer.label}
                    </p>
                  </div>
                  <p className="mt-3 max-w-2xl pl-[3.25rem] text-sm leading-7 text-slate-300">
                    {answer.flavor}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                    {isSelected ? "Locked" : "Select"}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rotate-45 border transition duration-300",
                      isSelected
                        ? "border-gold-300/70 bg-gold-300/18 shadow-[0_0_18px_rgba(217,181,94,0.22)]"
                        : "border-white/12 bg-white/[0.03] group-hover:border-gold-300/35",
                    )}
                  >
                    <span className="-rotate-45 text-[11px] text-white">
                      {isSelected ? "✓" : "•"}
                    </span>
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "primary" | "secondary";
}

export function buttonClasses(
  tone: "primary" | "secondary" = "primary",
  className?: string,
) {
  return cn(
    "ui-bevel group relative inline-flex items-center justify-center overflow-hidden border-2 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] transition duration-200",
    tone === "primary"
      ? "border-gold-400/90 bg-[linear-gradient(180deg,rgba(217,181,94,0.28),rgba(94,64,22,0.56))] text-gold-200 shadow-[0_12px_34px_rgba(102,69,20,0.3),0_0_22px_rgba(217,181,94,0.18)] hover:-translate-y-0.5 hover:border-gold-300 hover:text-white active:translate-y-0"
      : "border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(8,12,20,0.72))] text-slate-100 shadow-[0_12px_28px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:border-gold-400/45 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(12,18,28,0.76))] active:translate-y-0",
    className,
  );
}

export function ActionButton({
  children,
  className,
  tone = "primary",
  ...props
}: ActionButtonProps) {
  return (
    <button className={buttonClasses(tone, className)} {...props}>
      <span className="pointer-events-none absolute inset-[1px] border border-white/8 opacity-50 [clip-path:inherit]" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,220,141,0.95),transparent)]" />
      <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,rgba(242,220,141,0.18),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <span className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] [animation:flareSweep_1.1s_ease] opacity-70" />
      </span>
      <span className="relative z-10 flex items-center gap-3">
        <span className="h-0.5 w-5 bg-current/70" />
        <span>{children}</span>
      </span>
    </button>
  );
}

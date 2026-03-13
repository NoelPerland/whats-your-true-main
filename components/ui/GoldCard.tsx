import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GoldCardProps {
  children: ReactNode;
  className?: string;
}

export function GoldCard({ children, className }: GoldCardProps) {
  return (
    <div
      className={cn(
        "ui-bevel ui-chrome ui-noise p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,220,141,0.78),transparent)]" />
      <div className="pointer-events-none absolute inset-x-16 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(87,122,179,0.2),transparent)]" />
      <div className="pointer-events-none absolute left-5 top-5 h-3 w-3 rotate-45 border border-gold-300/40 bg-gold-300/10" />
      <div className="pointer-events-none absolute right-5 top-5 h-3 w-3 rotate-45 border border-gold-300/25 bg-gold-300/10" />
      <div className="pointer-events-none absolute bottom-5 left-5 h-3 w-3 rotate-45 border border-gold-300/25 bg-gold-300/10" />
      <div className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 rotate-45 border border-gold-300/4 bg-gold-300/10" />
      <div className="pointer-events-none absolute inset-0 ui-panel-grid opacity-[0.07]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

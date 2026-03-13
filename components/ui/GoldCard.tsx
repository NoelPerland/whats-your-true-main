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
        "ui-bevel ui-chrome p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgba(242,220,141,0.82),transparent)]" />
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-0.5 bg-[linear-gradient(90deg,transparent,rgba(87,122,179,0.24),transparent)]" />
      <div className="pointer-events-none absolute inset-0 ui-panel-grid opacity-[0.05]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

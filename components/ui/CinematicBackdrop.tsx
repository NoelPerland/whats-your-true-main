import { cn } from "@/lib/utils";

const particles = [
  { top: "7%", left: "10%", size: 4, delay: "0s", duration: "10s" },
  { top: "11%", left: "26%", size: 2, delay: "1s", duration: "14s" },
  { top: "16%", left: "72%", size: 3, delay: "2s", duration: "12s" },
  { top: "22%", left: "84%", size: 2, delay: "3s", duration: "9s" },
  { top: "28%", left: "18%", size: 2, delay: "5s", duration: "11s" },
  { top: "33%", left: "48%", size: 5, delay: "4s", duration: "16s" },
  { top: "39%", left: "62%", size: 4, delay: "6s", duration: "14s" },
  { top: "43%", left: "10%", size: 3, delay: "1s", duration: "13s" },
  { top: "48%", left: "80%", size: 2, delay: "4s", duration: "8s" },
  { top: "55%", left: "34%", size: 3, delay: "3s", duration: "12s" },
  { top: "61%", left: "68%", size: 5, delay: "5s", duration: "10s" },
  { top: "68%", left: "22%", size: 2, delay: "2s", duration: "9s" },
  { top: "74%", left: "54%", size: 3, delay: "7s", duration: "12s" },
  { top: "82%", left: "76%", size: 2, delay: "1s", duration: "15s" },
  { top: "86%", left: "38%", size: 4, delay: "4s", duration: "13s" },
];

const variantClasses = {
  landing:
    "from-[#06101d] via-[#091425] to-[#04070f] before:bg-[radial-gradient(circle_at_top,rgba(90,142,219,0.2),transparent_40%)]",
  quiz:
    "from-[#03070f] via-[#081525] to-[#060913] before:bg-[radial-gradient(circle_at_20%_20%,rgba(37,104,168,0.18),transparent_35%)]",
  result:
    "from-[#040712] via-[#0a172d] to-[#03050d] before:bg-[radial-gradient(circle_at_center,rgba(217,181,94,0.12),transparent_42%)]",
} as const;

interface CinematicBackdropProps {
  variant?: keyof typeof variantClasses;
  className?: string;
}

export function CinematicBackdrop({
  variant = "landing",
  className,
}: CinematicBackdropProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#03060d_0%,#07111e_50%,#02040a_100%)]",
        className,
      )}
    >
      <div className={cn("absolute inset-0 before:absolute before:inset-0", variantClasses[variant])} />
      <div className="absolute inset-[-12%] animate-aurora rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(217,181,94,0.13),transparent_20%),radial-gradient(circle_at_70%_40%,rgba(42,118,192,0.16),transparent_24%),radial-gradient(circle_at_48%_65%,rgba(28,60,110,0.28),transparent_32%)] blur-3xl" />
      <div className="absolute inset-x-[15%] top-[-10%] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(217,181,94,0.1),transparent_60%)] blur-3xl" />
      <div className="absolute inset-y-0 left-[12%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),transparent)]" />
      <div className="absolute inset-y-0 right-[12%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute inset-x-0 top-[18%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.62))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_28%,transparent_72%,rgba(255,255,255,0.02))]" />

      {particles.map((particle, index) => (
        <span
          key={`${particle.top}-${particle.left}-${index}`}
          className="absolute rounded-full bg-gold-300/70 shadow-[0_0_12px_rgba(242,220,141,0.45)]"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animation: `particleDrift ${particle.duration} ease-in-out ${particle.delay} infinite`,
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:96px_96px]" />
    </div>
  );
}

import { ResultExperience } from "@/components/result/ResultExperience";
import { CinematicBackdrop } from "@/components/ui/CinematicBackdrop";

export default function ResultPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <CinematicBackdrop variant="result" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <ResultExperience />
      </div>
    </main>
  );
}

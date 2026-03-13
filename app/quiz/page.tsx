import { QuizExperience } from "@/components/quiz/QuizExperience";
import { CinematicBackdrop } from "@/components/ui/CinematicBackdrop";

export default function QuizPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <CinematicBackdrop variant="quiz" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <QuizExperience />
      </div>
    </main>
  );
}

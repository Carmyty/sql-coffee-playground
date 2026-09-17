import { notFound } from "next/navigation";
import { ExercisePageShell } from "@/components/exercise/exercise-page-shell";
import { getExercise } from "@/data/exercises";
import { ExerciseWorkspace } from "@/components/exercise/exercise-workspace";

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ moduleId: string; exerciseId: string }>;
}) {
  const { moduleId, exerciseId } = await params;
  const exercise = getExercise(exerciseId);
  if (!exercise || exercise.moduleId !== moduleId) notFound();

  return (
    <ExercisePageShell exercise={exercise}>
      <div className="animate-fade-up">
        <ExerciseWorkspace exercise={exercise} />
      </div>
    </ExercisePageShell>
  );
}

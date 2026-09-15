"use client";

import { useProgress } from "@/hooks/use-progress";
import { getModuleExercises } from "@/data/exercises";
import { Progress } from "@/components/ui/progress";

export function ModuleProgress({ moduleId }: { moduleId: string }) {
  const { getExercise } = useProgress();
  const exercises = getModuleExercises(moduleId);
  const completed = exercises.filter((exercise) => getExercise(exercise.id).status === "correct").length;
  const percent = exercises.length === 0 ? 0 : Math.round((completed / exercises.length) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[color:var(--muted-text)]">
        <span>Progreso del módulo</span>
        <span>
          {completed}/{exercises.length}
        </span>
      </div>
      <Progress value={percent} />
    </div>
  );
}

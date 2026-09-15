"use client";

import { useProgress } from "@/hooks/use-progress";
import { Badge } from "@/components/ui/badge";

export function ExerciseStatusBadge({ exerciseId }: { exerciseId: string }) {
  const { getExercise } = useProgress();
  const status = getExercise(exerciseId).status;
  const label =
    status === "correct" ? "Correcto" : status === "in_progress" ? "En progreso" : "Pendiente";
  return <Badge variant={status === "correct" ? "default" : "outline"}>{label}</Badge>;
}

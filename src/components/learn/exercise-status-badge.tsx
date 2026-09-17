"use client";

import { useProgress } from "@/hooks/use-progress";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";

export function ExerciseStatusBadge({ exerciseId }: { exerciseId: string }) {
  const { getExercise } = useProgress();
  const { t } = useLanguage();
  const status = getExercise(exerciseId).status;
  const label =
    status === "correct"
      ? t("statusCorrect")
      : status === "in_progress"
        ? t("statusInProgress")
        : t("statusNotStarted");
  return <Badge variant={status === "correct" ? "default" : "outline"}>{label}</Badge>;
}

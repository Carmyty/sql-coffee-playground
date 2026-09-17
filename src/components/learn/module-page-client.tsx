"use client";

import Link from "next/link";
import type { Exercise, LearningModule } from "@/data/types";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleProgress } from "@/components/learn/module-progress";
import { ExerciseStatusBadge } from "@/components/learn/exercise-status-badge";
import { useLanguage } from "@/hooks/use-language";
import { localizeModule } from "@/lib/i18n/modules-en";
import { localizeExercise } from "@/lib/i18n/exercises-en";

export function ModulePageClient({
  learningModule,
  exercises,
}: {
  learningModule: LearningModule;
  exercises: Exercise[];
}) {
  const { locale, t } = useLanguage();
  const localizedModule = localizeModule(learningModule, locale);

  function difficultyLabel(difficulty: Exercise["difficulty"]) {
    if (difficulty === "basico") return t("difficultyBasico");
    if (difficulty === "intermedio") return t("difficultyIntermedio");
    return t("difficultyAvanzado");
  }

  return (
    <AppShell title={localizedModule.title}>
      <div className="animate-fade-up space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              {localizedModule.title}
            </CardTitle>
            <CardDescription>{localizedModule.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ModuleProgress moduleId={learningModule.id} />
            <p className="text-sm text-[color:var(--muted-text)]">
              {learningModule.estimatedMinutes} {t("min")}
            </p>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const localized = localizeExercise(exercise, locale);
            return (
              <Card key={exercise.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <Badge>{difficultyLabel(exercise.difficulty)}</Badge>
                    <Badge variant="secondary">
                      {exercise.estimatedMinutes} {t("min")}
                    </Badge>
                    <ExerciseStatusBadge exerciseId={exercise.id} />
                  </div>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/learn/${learningModule.id}/${exercise.id}`}
                      className="break-words hover:text-[color:var(--accent)]"
                    >
                      {localized.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{localized.objective}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {exercise.concepts.map((concept) => (
                    <Badge key={concept} variant="outline">
                      {concept}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

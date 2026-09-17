"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LEARNING_MODULES } from "@/data/modules";
import { ALL_EXERCISES, getModuleExercises } from "@/data/exercises";
import { conceptOfTheDay } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";
import { useLanguage } from "@/hooks/use-language";
import { localizeExercise } from "@/lib/i18n/exercises-en";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { locale, t } = useLanguage();
  const { completedCount, inProgressCount, recentExercises, getExercise, state } = useProgress();
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);
  const concept = conceptOfTheDay();
  const nextExercise =
    ALL_EXERCISES.find((exercise) => getExercise(exercise.id).status !== "correct") || ALL_EXERCISES[0];
  const nextLocalized = localizeExercise(nextExercise, locale);
  const completedModules = LEARNING_MODULES.filter((module) => {
    const exercises = getModuleExercises(module.id);
    return exercises.length > 0 && exercises.every((exercise) => getExercise(exercise.id).status === "correct");
  }).length;

  function statusLabel(status: string) {
    if (status === "correct") return t("statusCorrect");
    if (status === "in_progress") return t("statusInProgress");
    return t("statusNotStarted");
  }

  function difficultyLabel(difficulty: string) {
    if (difficulty === "basico") return t("difficultyBasico");
    if (difficulty === "intermedio") return t("difficultyIntermedio");
    return t("difficultyAvanzado");
  }

  return (
    <AppShell title={t("pageDashboard")}>
      <div className="animate-fade-up space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>{t("totalProgress")}</CardDescription>
              <CardTitle className="text-3xl">{percent}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={percent} />
              <p className="mt-2 text-xs text-[color:var(--muted-text)]">
                {t("exercisesCorrect", { done: completedCount, total: ALL_EXERCISES.length })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>{t("modulesCompleted")}</CardDescription>
              <CardTitle className="text-3xl">
                {completedModules}/{LEARNING_MODULES.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>{t("inProgress")}</CardDescription>
              <CardTitle className="text-3xl">{inProgressCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>{t("streak")}</CardDescription>
              <CardTitle className="text-3xl">
                {state.streak} {t("streakDays")}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("nextRecommended")}</CardTitle>
              <CardDescription>{t("nextRecommendedDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{difficultyLabel(nextExercise.difficulty)}</Badge>
                <Badge variant="outline">
                  {nextExercise.estimatedMinutes} {t("min")}
                </Badge>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--ink)] sm:text-2xl">
                {nextLocalized.title}
              </h2>
              <p className="text-sm text-[color:var(--muted-text)]">{nextLocalized.objective}</p>
              <Button
                className="max-sm:w-full"
                render={<Link href={`/learn/${nextExercise.moduleId}/${nextExercise.id}`} />}
              >
                {t("openExercise")}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("conceptOfDay")}</CardTitle>
              <CardDescription>{concept.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{concept.summary}</p>
              <Button variant="outline" className="max-sm:w-full" render={<Link href={`/lessons/${concept.id}`} />}>
                {t("readMiniLesson")}
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("recentExercises")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentExercises.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-text)]">{t("noActivityYet")}</p>
              ) : (
                recentExercises.map((id) => {
                  const exercise = ALL_EXERCISES.find((item) => item.id === id);
                  if (!exercise) return null;
                  const progress = getExercise(id);
                  const localized = localizeExercise(exercise, locale);
                  return (
                    <Link
                      key={id}
                      href={`/learn/${exercise.moduleId}/${exercise.id}`}
                      className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[color:var(--border-soft)] px-3 py-2 text-sm hover:bg-[color:var(--cream)]/50"
                    >
                      <span className="min-w-0 flex-1 truncate">{localized.title}</span>
                      <Badge variant="outline">{statusLabel(progress.status)}</Badge>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("quickPath")}</CardTitle>
              <CardDescription>{t("quickPathDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/learn" />}>
                {t("navLearn")}
              </Button>
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/explore" />}>
                {t("navExplore")}
              </Button>
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/lab" />}>
                {t("navLab")}
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

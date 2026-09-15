"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LEARNING_MODULES } from "@/data/modules";
import { ALL_EXERCISES, getModuleExercises } from "@/data/exercises";
import { conceptOfTheDay } from "@/data/lessons";
import { useProgress } from "@/hooks/use-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { completedCount, inProgressCount, recentExercises, getExercise, state } = useProgress();
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);
  const concept = conceptOfTheDay();
  const nextExercise =
    ALL_EXERCISES.find((exercise) => getExercise(exercise.id).status !== "correct") || ALL_EXERCISES[0];
  const completedModules = LEARNING_MODULES.filter((module) => {
    const exercises = getModuleExercises(module.id);
    return exercises.length > 0 && exercises.every((exercise) => getExercise(exercise.id).status === "correct");
  }).length;

  return (
    <AppShell title="Dashboard">
      <div className="animate-fade-up space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Progreso total</CardDescription>
              <CardTitle className="text-3xl">{percent}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={percent} />
              <p className="mt-2 text-xs text-[color:var(--muted-text)]">
                {completedCount} de {ALL_EXERCISES.length} ejercicios correctos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Módulos completados</CardDescription>
              <CardTitle className="text-3xl">
                {completedModules}/{LEARNING_MODULES.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>En progreso</CardDescription>
              <CardTitle className="text-3xl">{inProgressCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Racha</CardDescription>
              <CardTitle className="text-3xl">{state.streak} días</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Siguiente recomendado</CardTitle>
              <CardDescription>Continúa donde el camino tiene más sentido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{nextExercise.difficulty}</Badge>
                <Badge variant="outline">{nextExercise.estimatedMinutes} min</Badge>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--coffee-dark)] sm:text-2xl">
                {nextExercise.title}
              </h2>
              <p className="text-sm text-[color:var(--muted-text)]">{nextExercise.objective}</p>
              <Button className="max-sm:w-full" render={<Link href={`/learn/${nextExercise.moduleId}/${nextExercise.id}`} />}>
                Abrir ejercicio
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Concepto del día</CardTitle>
              <CardDescription>{concept.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{concept.summary}</p>
              <Button variant="outline" className="max-sm:w-full" render={<Link href={`/lessons/${concept.id}`} />}>
                Leer mini lección
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Últimos ejercicios visitados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentExercises.length === 0 ? (
                <p className="text-sm text-[color:var(--muted-text)]">
                  Aún no hay actividad. Empieza por el módulo de fundamentos.
                </p>
              ) : (
                recentExercises.map((id) => {
                  const exercise = ALL_EXERCISES.find((item) => item.id === id);
                  if (!exercise) return null;
                  const progress = getExercise(id);
                  return (
                    <Link
                      key={id}
                      href={`/learn/${exercise.moduleId}/${exercise.id}`}
                      className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-[color:var(--cream)] px-3 py-2 text-sm hover:bg-[color:var(--cream)]/50"
                    >
                      <span className="min-w-0 flex-1 truncate">{exercise.title}</span>
                      <Badge variant="outline">{progress.status}</Badge>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ruta rápida</CardTitle>
              <CardDescription>Explora módulos, datos y el laboratorio libre.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/learn" />}>
                Ruta de aprendizaje
              </Button>
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/explore" />}>
                Explorar datos
              </Button>
              <Button variant="outline" className="max-sm:w-full" render={<Link href="/lab" />}>
                Laboratorio
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

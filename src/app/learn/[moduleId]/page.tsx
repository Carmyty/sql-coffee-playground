import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LEARNING_MODULES } from "@/data/modules";
import { getModuleExercises } from "@/data/exercises";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleProgress } from "@/components/learn/module-progress";
import { ExerciseStatusBadge } from "@/components/learn/exercise-status-badge";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const learningModule = LEARNING_MODULES.find((item) => item.id === moduleId);
  if (!learningModule) notFound();
  const exercises = getModuleExercises(learningModule.id);

  return (
    <AppShell title={learningModule.title}>
      <div className="animate-fade-up space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">{learningModule.title}</CardTitle>
            <CardDescription>{learningModule.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ModuleProgress moduleId={learningModule.id} />
            <p className="text-sm text-[color:var(--muted-text)]">
              Tiempo estimado: {learningModule.estimatedMinutes} minutos
            </p>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <Badge>{exercise.difficulty}</Badge>
                  <Badge variant="secondary">{exercise.estimatedMinutes} min</Badge>
                  <ExerciseStatusBadge exerciseId={exercise.id} />
                </div>
                <CardTitle className="text-lg">
                  <Link
                    href={`/learn/${learningModule.id}/${exercise.id}`}
                    className="break-words hover:text-[color:var(--terracotta)]"
                  >
                    {exercise.title}
                  </Link>
                </CardTitle>
                <CardDescription>{exercise.objective}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {exercise.concepts.map((concept) => (
                  <Badge key={concept} variant="outline">
                    {concept}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

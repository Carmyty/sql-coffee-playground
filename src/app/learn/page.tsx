import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LEARNING_MODULES } from "@/data/modules";
import { getModuleExercises } from "@/data/exercises";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleProgress } from "@/components/learn/module-progress";

export default function LearnIndexPage() {
  return (
    <AppShell title="Ruta de aprendizaje">
      <div className="animate-fade-up space-y-4">
        <p className="max-w-3xl text-sm text-[color:var(--muted-text)]">
          Los módulos se desbloquean de forma progresiva. Cada ejercicio explica el objetivo, da pistas
          graduales y valida por resultado — no por una única query mágica.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {LEARNING_MODULES.map((module) => {
            const exercises = getModuleExercises(module.id);
            return (
              <Card key={module.id} className="border-[color:var(--cream)]">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Módulo {module.order}</Badge>
                    <Badge variant="secondary">{module.estimatedMinutes} min</Badge>
                  </div>
                  <CardTitle className="font-[family-name:var(--font-display)] text-xl">
                    <Link href={`/learn/${module.id}`} className="hover:text-[color:var(--terracotta)]">
                      {module.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {module.prerequisites.length > 0 ? (
                    <p className="text-[color:var(--muted-text)]">
                      Prerrequisitos: {module.prerequisites.join(", ")}
                    </p>
                  ) : (
                    <p className="text-[color:var(--muted-text)]">Sin prerrequisitos</p>
                  )}
                  <p>{exercises.length} ejercicios</p>
                  <ModuleProgress moduleId={module.id} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

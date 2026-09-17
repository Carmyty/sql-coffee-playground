"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LEARNING_MODULES } from "@/data/modules";
import { getModuleExercises } from "@/data/exercises";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleProgress } from "@/components/learn/module-progress";
import { useLanguage } from "@/hooks/use-language";
import { localizeModule } from "@/lib/i18n/modules-en";

export default function LearnIndexPage() {
  const { locale, t } = useLanguage();

  return (
    <AppShell title={t("pageLearn")}>
      <div className="animate-fade-up space-y-4">
        <p className="max-w-3xl text-sm text-[color:var(--muted-text)]">{t("learnIntro")}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {LEARNING_MODULES.map((module) => {
            const exercises = getModuleExercises(module.id);
            const localized = localizeModule(module, locale);
            return (
              <Card key={module.id} className="border-[color:var(--border-soft)]">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{t("moduleLabel", { n: module.order })}</Badge>
                    <Badge variant="secondary">
                      {module.estimatedMinutes} {t("min")}
                    </Badge>
                  </div>
                  <CardTitle className="font-[family-name:var(--font-display)] text-xl">
                    <Link href={`/learn/${module.id}`} className="hover:text-[color:var(--accent)]">
                      {localized.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{localized.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {module.prerequisites.length > 0 ? (
                    <p className="text-[color:var(--muted-text)]">
                      {t("prerequisites")}: {module.prerequisites.join(", ")}
                    </p>
                  ) : (
                    <p className="text-[color:var(--muted-text)]">{t("noPrerequisites")}</p>
                  )}
                  <p>{t("exercisesCount", { n: exercises.length })}</p>
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

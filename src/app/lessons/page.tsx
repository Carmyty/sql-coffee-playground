"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LESSONS } from "@/data/lessons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

export default function LessonsPage() {
  const { t } = useLanguage();

  return (
    <AppShell title={t("pageLessons")}>
      <div className="animate-fade-up grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LESSONS.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {lesson.minutes} {t("min")}
                </Badge>
              </div>
              <CardTitle>
                <Link href={`/lessons/${lesson.id}`} className="hover:text-[color:var(--accent)]">
                  {lesson.title}
                </Link>
              </CardTitle>
              <CardDescription>{lesson.summary}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[color:var(--muted-text)]">{lesson.structure}</CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

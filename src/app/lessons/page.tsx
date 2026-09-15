import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LESSONS } from "@/data/lessons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LessonsPage() {
  return (
    <AppShell title="Mini lecciones">
      <div className="animate-fade-up grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LESSONS.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{lesson.minutes} min</Badge>
              </div>
              <CardTitle>
                <Link href={`/lessons/${lesson.id}`} className="hover:text-[color:var(--terracotta)]">
                  {lesson.title}
                </Link>
              </CardTitle>
              <CardDescription>{lesson.summary}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[color:var(--muted-text)]">
              {lesson.structure}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

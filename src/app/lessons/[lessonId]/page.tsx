"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getLesson } from "@/data/lessons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LessonDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const [selected, setSelected] = useState<number | null>(null);
  if (!lesson) notFound();

  const answered = selected !== null;
  const correct = selected === lesson.quiz.answer;

  return (
    <AppShell title={lesson.title}>
      <div className="animate-fade-up mx-auto max-w-3xl space-y-4">
        <Card>
          <CardHeader>
            <Badge variant="outline">{lesson.minutes} min de lectura</Badge>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl">{lesson.title}</CardTitle>
            <CardDescription>{lesson.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="mb-1 font-medium">Estructura</p>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[color:var(--coffee-dark)] p-3 text-[color:var(--cream)]">
                {lesson.structure}
              </pre>
            </div>
            <div>
              <p className="mb-1 font-medium">Ejemplo ilustrativo</p>
              <p>{lesson.example}</p>
            </div>
            <div>
              <p className="mb-1 font-medium">Errores comunes</p>
              <ul className="list-disc space-y-1 pl-5">
                {lesson.commonMistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-medium">Cuándo usarlo</p>
              <p>{lesson.whenToUse}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autoevaluación</CardTitle>
            <CardDescription>{lesson.quiz.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lesson.quiz.options.map((option, index) => (
              <Button
                key={option}
                variant={selected === index ? "default" : "outline"}
                className="h-auto min-h-11 w-full justify-start whitespace-normal py-2 text-left"
                onClick={() => setSelected(index)}
              >
                {option}
              </Button>
            ))}
            {answered ? (
              <Alert>
                <AlertTitle>{correct ? "Correcto" : "Casi"}</AlertTitle>
                <AlertDescription>{lesson.quiz.explanation}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

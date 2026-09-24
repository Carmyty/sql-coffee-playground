"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DOC_CONCEPTS } from "@/data/docs-concepts";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRightLeft,
  Filter,
  Group,
  ListOrdered,
  PenLine,
  Rows3,
  Sparkles,
} from "lucide-react";

const icons = {
  select: Rows3,
  filter: Filter,
  sort: ListOrdered,
  join: ArrowRightLeft,
  group: Group,
  write: PenLine,
  top: Sparkles,
};

export default function DocsPage() {
  const { locale } = useLanguage();
  const es = locale === "es";

  return (
    <AppShell title={es ? "Documentación visual" : "Visual documentation"}>
      <div className="animate-fade-up mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--accent-soft)]/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-text)]">
            T-SQL · SQL Server
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[color:var(--ink)] sm:text-3xl">
            {es ? "Conceptos claros, paso a paso" : "Clear concepts, step by step"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-text)] sm:text-base">
            {es
              ? "Inspirado en experiencias tipo SQLBolt: cada idea se muestra con una mini historia visual, un ejemplo T-SQL y un tip práctico. Luego practicas en los ejercicios con resultados en vivo."
              : "Inspired by SQLBolt-style learning: each idea has a tiny visual story, a T-SQL example, and a practical tip. Then you practice in exercises with live results."}
          </p>
          <Link
            href="/learn"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[color:var(--accent)] hover:underline"
          >
            {es ? "Ir a la ruta de ejercicios →" : "Go to the exercise path →"}
          </Link>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {DOC_CONCEPTS.map((concept, index) => {
            const Icon = icons[concept.icon];
            return (
              <Card
                key={concept.id}
                className="overflow-hidden border-[color:var(--border-soft)] transition-transform hover:-translate-y-0.5"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div>
                      <Badge variant="outline">#{index + 1}</Badge>
                      <CardTitle className="mt-1 text-lg">
                        {es ? concept.titleEs : concept.titleEn}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {es ? concept.summaryEs : concept.summaryEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--cream)]/70 px-3 py-3 text-sm text-[color:var(--ink)]">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
                      {es ? "En una frase visual" : "Visual in one line"}
                    </p>
                    {es ? concept.visualEs : concept.visualEn}
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-[color:var(--ink)] p-3 font-mono text-xs text-[color:var(--page-bg)]">
                    {concept.exampleTsql}
                  </pre>
                  <p className="text-xs text-[color:var(--muted-text)]">
                    <span className="font-semibold text-[color:var(--accent)]">Tip:</span>{" "}
                    {es ? concept.tipEs : concept.tipEn}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

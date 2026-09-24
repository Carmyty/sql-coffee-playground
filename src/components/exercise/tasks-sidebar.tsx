"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export type TaskItem = {
  id: string;
  label: string;
  state: "active" | "done" | "locked";
  href?: string;
};

type TasksSidebarProps = {
  exerciseOrder: number;
  tasks: TaskItem[];
  expectedDescription?: string;
  showSolutionLink?: boolean;
  onShowSolution?: () => void;
  finishEnabled: boolean;
  finishHref?: string;
  onAskHint?: () => void;
  hintLevel: number;
};

export function TasksSidebar({
  exerciseOrder,
  tasks,
  expectedDescription,
  showSolutionLink,
  onShowSolution,
  finishEnabled,
  finishHref,
  onAskHint,
  hintLevel,
}: TasksSidebarProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";

  return (
    <aside className="flex h-full flex-col gap-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--cream)] p-4 lg:min-h-[28rem]">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--ink)]">
          {es ? `Ejercicio ${exerciseOrder} — Tareas` : `Exercise ${exerciseOrder} — Tasks`}
        </h3>
        <p className="mt-1 text-xs text-[color:var(--muted-text)]">
          {es
            ? "La consulta se comprueba sola mientras escribes."
            : "Your query is checked automatically as you type."}
        </p>
      </div>

      <ol className="space-y-3">
        {tasks.map((task, index) => (
          <li key={task.id}>
            <div
              className={cn(
                "flex gap-2.5 text-sm leading-snug transition-colors",
                task.state === "active" && "text-[color:var(--ink)]",
                task.state === "done" && "text-[color:var(--success)]",
                task.state === "locked" && "text-[color:var(--muted-text)]/70"
              )}
            >
              <span className="mt-0.5 shrink-0">
                {task.state === "done" ? (
                  <CheckCircle2 className="size-4 check-burst" />
                ) : task.state === "locked" ? (
                  <Lock className="size-3.5 opacity-60" />
                ) : (
                  <Circle className="size-4" />
                )}
              </span>
              <span>
                <span className="font-semibold tabular-nums">{index + 1}. </span>
                {task.state === "locked" && task.href ? (
                  <span>{task.label}</span>
                ) : (
                  <span className={task.state === "active" ? "underline decoration-[color:var(--accent)]/40 decoration-2 underline-offset-2" : undefined}>
                    {task.label}
                  </span>
                )}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {expectedDescription ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
            {t("expectedResult")}
          </p>
          <p className="text-sm text-[color:var(--ink)]">{expectedDescription}</p>
        </div>
      ) : null}

      <div className="mt-auto space-y-3 border-t border-[color:var(--border-soft)] pt-3">
        {onAskHint ? (
          <button
            type="button"
            onClick={onAskHint}
            disabled={hintLevel >= 3}
            className="text-left text-sm text-[color:var(--accent)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {es ? `¿Atascado? Pedir pista (${hintLevel}/3)` : `Stuck? Ask for a hint (${hintLevel}/3)`}
          </button>
        ) : null}

        {showSolutionLink ? (
          <button
            type="button"
            onClick={onShowSolution}
            className="block text-left text-sm text-[color:var(--accent)] underline-offset-2 hover:underline"
          >
            {es ? "¿Atascado? Ver la solución de esta tarea." : "Stuck? Read this task's Solution."}
          </button>
        ) : null}

        <p className="text-xs text-[color:var(--muted-text)]">
          {es
            ? "Resuelve la tarea para continuar a la siguiente lección."
            : "Solve all tasks to continue to the next lesson."}
        </p>

        {finishEnabled && finishHref ? (
          <Link
            href={finishHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "pressable w-full bg-[color:var(--accent)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--accent)]/90"
            )}
          >
            {es ? "Terminar tareas de arriba" : "Finish above Tasks"}
          </Link>
        ) : (
          <Button size="lg" className="w-full" disabled>
            {es ? "Terminar tareas de arriba" : "Finish above Tasks"}
          </Button>
        )}
      </div>
    </aside>
  );
}

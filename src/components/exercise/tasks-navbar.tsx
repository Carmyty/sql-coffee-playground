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
};

type TasksNavbarProps = {
  exerciseOrder: number;
  tasks: TaskItem[];
  expectedDescription?: string;
  onSelectTask?: (taskId: string) => void;
  showSolutionLink?: boolean;
  onShowSolution?: () => void;
  finishEnabled: boolean;
  finishHref?: string;
  onAskHint?: () => void;
  hintLevel: number;
};

export function TasksNavbar({
  exerciseOrder,
  tasks,
  expectedDescription,
  onSelectTask,
  showSolutionLink,
  onShowSolution,
  finishEnabled,
  finishHref,
  onAskHint,
  hintLevel,
}: TasksNavbarProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";

  return (
    <section className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--cream)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--border-soft)] px-3 py-2.5 sm:px-4">
        <h3 className="font-[family-name:var(--font-display)] text-base text-[color:var(--ink)] sm:text-lg">
          {es ? `Ejercicio ${exerciseOrder} — Tareas` : `Exercise ${exerciseOrder} — Tasks`}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {onAskHint ? (
            <button
              type="button"
              onClick={onAskHint}
              disabled={hintLevel >= 3}
              className="text-xs text-[color:var(--accent)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              {es ? `Pista (${hintLevel}/3)` : `Hint (${hintLevel}/3)`}
            </button>
          ) : null}
          {showSolutionLink ? (
            <button
              type="button"
              onClick={onShowSolution}
              className="text-xs text-[color:var(--accent)] underline-offset-2 hover:underline sm:text-sm"
            >
              {es ? "Solución" : "Solution"}
            </button>
          ) : null}
          {finishEnabled && finishHref ? (
            <Link
              href={finishHref}
              className={cn(
                buttonVariants({ size: "sm" }),
                "pressable bg-[color:var(--accent)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--accent)]/90"
              )}
            >
              {es ? "Continuar" : "Continue"}
            </Link>
          ) : (
            <Button size="sm" disabled>
              {es ? "Continuar" : "Continue"}
            </Button>
          )}
        </div>
      </div>

      <ol className="flex gap-2 overflow-x-auto px-3 py-3 sm:px-4">
        {tasks.map((task, index) => {
          const clickable = task.state === "active" || task.state === "done";
          return (
            <li key={task.id} className="min-w-[12rem] max-w-[18rem] shrink-0">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelectTask?.(task.id)}
                className={cn(
                  "flex h-full w-full gap-2 rounded-lg border px-3 py-2.5 text-left text-sm leading-snug transition-colors",
                  task.state === "active" &&
                    "border-[color:var(--accent)] bg-[color:var(--surface)] text-[color:var(--ink)] shadow-sm",
                  task.state === "done" &&
                    "border-[color:var(--success)]/40 bg-[color:var(--success-soft)] text-[color:var(--success)]",
                  task.state === "locked" &&
                    "cursor-not-allowed border-transparent bg-transparent text-[color:var(--muted-text)]/65"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {task.state === "done" ? (
                    <CheckCircle2 className="size-4 check-burst" />
                  ) : task.state === "locked" ? (
                    <Lock className="size-3.5 opacity-60" />
                  ) : (
                    <Circle className="size-4 text-[color:var(--accent)]" />
                  )}
                </span>
                <span>
                  <span className="font-semibold tabular-nums">{index + 1}. </span>
                  {task.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {expectedDescription ? (
        <div className="border-t border-[color:var(--border-soft)] px-3 py-3 sm:px-4">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
            {t("expectedResult")}
          </p>
          <p className="text-sm text-[color:var(--ink)]">{expectedDescription}</p>
        </div>
      ) : null}
    </section>
  );
}

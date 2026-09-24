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

type TasksSidebarProps = {
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

export function TasksSidebar({
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
}: TasksSidebarProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";

  return (
    <aside className="flex h-full min-h-[28rem] flex-col gap-4 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--cream)] p-4">
      <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--ink)]">
        {es ? `Ejercicio ${exerciseOrder} — Tareas` : `Exercise ${exerciseOrder} — Tasks`}
      </h3>

      <ol className="space-y-3">
        {tasks.map((task, index) => {
          const clickable = task.state === "active" || task.state === "done";
          return (
            <li key={task.id}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelectTask?.(task.id)}
                className={cn(
                  "flex w-full gap-2.5 rounded-lg px-1 py-1 text-left text-sm leading-snug transition-colors",
                  task.state === "active" && "text-[color:var(--ink)]",
                  task.state === "done" && "text-[color:var(--success)]",
                  task.state === "locked" && "cursor-not-allowed text-[color:var(--muted-text)]/70",
                  clickable && "hover:bg-[color:var(--surface)]/60"
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
                  <span
                    className={
                      task.state === "active"
                        ? "underline decoration-[color:var(--accent)]/40 decoration-2 underline-offset-2"
                        : undefined
                    }
                  >
                    {task.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
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
            {es ? `Pista (${hintLevel}/3)` : `Hint (${hintLevel}/3)`}
          </button>
        ) : null}

        {showSolutionLink ? (
          <button
            type="button"
            onClick={onShowSolution}
            className="block text-left text-sm text-[color:var(--accent)] underline-offset-2 hover:underline"
          >
            {es ? "Ver solución" : "Show solution"}
          </button>
        ) : null}

        {finishEnabled && finishHref ? (
          <Link
            href={finishHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "pressable w-full bg-[color:var(--accent)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--accent)]/90"
            )}
          >
            {es ? "Continuar" : "Continue"}
          </Link>
        ) : (
          <Button size="lg" className="w-full" disabled>
            {es ? "Continuar" : "Continue"}
          </Button>
        )}
      </div>
    </aside>
  );
}

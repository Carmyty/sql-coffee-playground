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
  embedded?: boolean;
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
  embedded = false,
}: TasksSidebarProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";

  return (
    <aside
      className={cn(
        "relative z-10 flex h-full min-h-0 w-full flex-col gap-3 p-3 sm:p-4",
        embedded
          ? "bg-[color:var(--cream)]"
          : "rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] shadow-sm lg:min-h-[32rem]"
      )}
    >
      <h3 className="shrink-0 font-[family-name:var(--font-display)] text-base text-[color:var(--ink)] sm:text-lg">
        {es ? `Ejercicio ${exerciseOrder} — Tareas` : `Exercise ${exerciseOrder} — Tasks`}
      </h3>

      <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task, index) => {
          const clickable = task.state === "active" || task.state === "done";
          return (
            <li key={task.id} className="block">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelectTask?.(task.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm leading-relaxed transition-colors",
                  task.state === "active" &&
                    "bg-[color:var(--surface)] text-[color:var(--ink)] ring-1 ring-[color:var(--accent)]/30",
                  task.state === "done" && "bg-[color:var(--success-soft)] text-[color:var(--success)]",
                  task.state === "locked" && "cursor-not-allowed text-[color:var(--muted-text)]/70",
                  clickable && task.state !== "active" && "hover:bg-[color:var(--surface)]/70"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {task.state === "done" ? (
                    <CheckCircle2 className="size-4" />
                  ) : task.state === "locked" ? (
                    <Lock className="size-3.5 opacity-60" />
                  ) : (
                    <Circle className="size-4 text-[color:var(--accent)]" />
                  )}
                </span>
                <span className="min-w-0 flex-1 overflow-hidden break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
                  <span className="font-semibold tabular-nums">{index + 1}. </span>
                  {task.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {expectedDescription ? (
        <div className="shrink-0 rounded-lg border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
            {t("expectedResult")}
          </p>
          <p className="text-sm leading-relaxed break-words text-[color:var(--ink)]">
            {expectedDescription}
          </p>
        </div>
      ) : null}

      <div className="flex shrink-0 flex-col gap-2 border-t border-[color:var(--border-soft)] pt-3">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {onAskHint ? (
            <button
              type="button"
              onClick={onAskHint}
              disabled={hintLevel >= 3}
              className="text-sm text-[color:var(--accent)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {es ? `Pista (${hintLevel}/3)` : `Hint (${hintLevel}/3)`}
            </button>
          ) : null}
          {showSolutionLink ? (
            <button
              type="button"
              onClick={onShowSolution}
              className="text-sm text-[color:var(--accent)] underline-offset-2 hover:underline"
            >
              {es ? "Ver solución" : "Show solution"}
            </button>
          ) : null}
        </div>

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

"use client";

import { Flame, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useProgress } from "@/hooks/use-progress";
import { ALL_EXERCISES } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function AppTopbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();
  const { completedCount, state } = useProgress();
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);

  return (
    <header className="shrink-0 border-b border-[color:var(--cream)] bg-white/80 px-3 py-2.5 backdrop-blur sm:px-4 md:px-6 md:py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="hidden text-xs uppercase tracking-[0.18em] text-[color:var(--muted-text)] sm:block">
            SQL Coffee Playground
          </p>
          <h1 className="truncate font-[family-name:var(--font-display)] text-lg text-[color:var(--coffee-dark)] sm:text-xl md:text-2xl">
            {title || "Aprende SQL con una cafetería"}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[color:var(--cream)] px-2.5 py-1.5 text-sm text-[color:var(--coffee-dark)] md:min-h-0 md:px-3"
            title="Racha de días activos"
          >
            <Flame className="size-4 text-[color:var(--terracotta)]" aria-hidden />
            <span className="tabular-nums">{state.streak}</span>
            <span className="hidden sm:inline">días</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-11 md:size-8"
            aria-label="Cambiar tema claro u oscuro"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>
        </div>
      </div>
      <div className="mt-2 min-w-0">
        <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--muted-text)]">
          <span>Progreso</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} className="w-full" />
      </div>
    </header>
  );
}

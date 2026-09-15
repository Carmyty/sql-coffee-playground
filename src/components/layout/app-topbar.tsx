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
    <header className="flex flex-col gap-3 border-b border-[color:var(--cream)] bg-white/80 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-text)]">SQL Coffee Playground</p>
        <h1 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--coffee-dark)] md:text-2xl">
          {title || "Aprende SQL con una cafetería"}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[160px] flex-1 md:min-w-[200px]">
          <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--muted-text)]">
            <span>Progreso</span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} className="w-full" />
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--cream)] px-3 py-1.5 text-sm text-[color:var(--coffee-dark)]"
          title="Racha de días activos"
        >
          <Flame className="size-4 text-[color:var(--terracotta)]" aria-hidden />
          {state.streak} días
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Cambiar tema claro u oscuro"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
      </div>
    </header>
  );
}

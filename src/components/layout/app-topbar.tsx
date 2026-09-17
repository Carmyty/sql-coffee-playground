"use client";

import { Flame, Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useLanguage } from "@/hooks/use-language";
import { ALL_EXERCISES } from "@/data/exercises";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function AppTopbar({ title }: { title?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, toggleLocale, t } = useLanguage();
  const { completedCount, state } = useProgress();
  const [mounted, setMounted] = useState(false);
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="shrink-0 border-b border-[color:var(--border-soft)] bg-[color:var(--surface)]/90 px-3 py-2.5 backdrop-blur sm:px-4 md:px-6 md:py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="hidden text-xs uppercase tracking-[0.18em] text-[color:var(--muted-text)] sm:block">
            {t("brandEyebrow")}
          </p>
          <h1 className="truncate font-[family-name:var(--font-display)] text-lg text-[color:var(--ink)] sm:text-xl md:text-2xl">
            {title || t("defaultTitle")}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[color:var(--cream)] px-2.5 py-1.5 text-sm text-[color:var(--ink)] md:min-h-0 md:px-3"
            title={locale === "es" ? "Racha de días activos" : "Active day streak"}
          >
            <Flame className="size-4 text-[color:var(--accent)]" aria-hidden />
            <span className="tabular-nums">{state.streak}</span>
            <span className="hidden sm:inline">{t("streakDays")}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="pressable h-11 min-w-11 gap-1.5 border-[color:var(--border-soft)] px-2.5 md:h-8"
            aria-label={locale === "es" ? t("languageToEn") : t("languageToEs")}
            title={locale === "es" ? t("languageToEn") : t("languageToEs")}
            onClick={toggleLocale}
          >
            <Languages className="size-4" />
            <span className="text-xs font-semibold tabular-nums">{locale === "es" ? "ES" : "EN"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 border-[color:var(--border-soft)] md:size-8"
            aria-label={isDark ? t("themeToLight") : t("themeToDark")}
            disabled={!mounted}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-2 min-w-0">
        <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--muted-text)]">
          <span>{t("progress")}</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <Progress value={percent} className="w-full" />
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Coffee,
  Compass,
  Flame,
  FlaskConical,
  Languages,
  LayoutDashboard,
  Library,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useProgress } from "@/hooks/use-progress";
import { ALL_EXERCISES } from "@/data/exercises";
import type { MessageKey } from "@/lib/i18n/messages";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const links: Array<{
  href: string;
  labelKey: MessageKey;
  shortKey: MessageKey;
  icon: typeof LayoutDashboard;
}> = [
  { href: "/", labelKey: "navDashboard", shortKey: "navDashboardShort", icon: LayoutDashboard },
  { href: "/learn", labelKey: "navLearn", shortKey: "navLearnShort", icon: BookOpenText },
  { href: "/docs", labelKey: "navDocs", shortKey: "navDocsShort", icon: Library },
  { href: "/explore", labelKey: "navExplore", shortKey: "navExploreShort", icon: Compass },
  { href: "/lab", labelKey: "navLab", shortKey: "navLabShort", icon: FlaskConical },
  { href: "/lessons", labelKey: "navLessons", shortKey: "navLessonsShort", icon: Coffee },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function AppNavbar({ title }: { title?: string }) {
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { completedCount, state } = useProgress();
  const [mounted, setMounted] = useState(false);
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[color:var(--border-soft)] bg-[color:var(--surface)]/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-3 py-2.5 sm:px-4 md:px-6">
          <Link href="/" className="mr-1 flex shrink-0 items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)]">
              <Coffee className="size-4.5 text-[color:var(--accent)]" />
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="font-[family-name:var(--font-display)] text-base text-[color:var(--ink)]">
                SQL Coffee
              </p>
              <p className="text-[10px] text-[color:var(--muted-text)]">Playground</p>
            </div>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex"
            aria-label="Principal"
          >
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[color:var(--accent)] text-[color:var(--primary-foreground)] shadow-sm"
                      : "text-[color:var(--ink)]/80 hover:bg-[color:var(--cream)]"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[color:var(--cream)] px-2.5 py-1 text-sm text-[color:var(--ink)]"
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
              className="pressable h-9 min-w-9 gap-1.5 border-[color:var(--border-soft)] px-2.5"
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
              className="size-9 border-[color:var(--border-soft)]"
              aria-label={isDark ? t("themeToLight") : t("themeToDark")}
              disabled={!mounted}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-3 pb-2.5 sm:px-4 md:px-6">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs text-[color:var(--muted-text)]">
            <span className="truncate font-[family-name:var(--font-display)] text-sm text-[color:var(--ink)] sm:text-base">
              {title || t("defaultTitle")}
            </span>
            <span className="shrink-0 tabular-nums">
              {t("progress")} {percent}%
            </span>
          </div>
          <Progress value={percent} className="w-full" />
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-[color:var(--border-soft)] bg-[color:var(--surface)] pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Navegación móvil"
      >
        <div className="flex w-full">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium",
                  active ? "text-[color:var(--accent)]" : "text-[color:var(--muted-text)]"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{t(link.shortKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

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
      <header className="sticky top-0 z-40 overflow-x-hidden border-b border-[color:var(--border-soft)] bg-[color:var(--surface)] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:px-4 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] sm:size-9 sm:rounded-2xl">
              <Coffee className="size-4 text-[color:var(--accent)]" />
            </div>
            <div className="hidden leading-tight xl:block">
              <p className="font-[family-name:var(--font-display)] text-sm text-[color:var(--ink)]">
                SQL Coffee
              </p>
              <p className="text-[10px] text-[color:var(--muted-text)]">Playground</p>
            </div>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
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
                  title={t(link.labelKey)}
                  className={cn(
                    "inline-flex max-w-[9.5rem] items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors xl:max-w-none xl:gap-1.5 xl:px-2.5 xl:text-sm",
                    active
                      ? "bg-[color:var(--accent)] text-[color:var(--primary-foreground)]"
                      : "text-[color:var(--ink)]/80 hover:bg-[color:var(--cream)]"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate xl:hidden">{t(link.shortKey)}</span>
                  <span className="hidden truncate xl:inline">{t(link.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[color:var(--cream)] px-2 text-xs text-[color:var(--ink)] sm:h-9 sm:px-2.5 sm:text-sm"
              title={locale === "es" ? "Racha de días activos" : "Active day streak"}
            >
              <Flame className="size-3.5 text-[color:var(--accent)] sm:size-4" aria-hidden />
              <span className="tabular-nums">{state.streak}</span>
              <span className="hidden md:inline">{t("streakDays")}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="pressable h-8 gap-1 border-[color:var(--border-soft)] px-2 sm:h-9 sm:px-2.5"
              aria-label={locale === "es" ? t("languageToEn") : t("languageToEs")}
              title={locale === "es" ? t("languageToEn") : t("languageToEs")}
              onClick={toggleLocale}
            >
              <Languages className="size-3.5 sm:size-4" />
              <span className="text-xs font-semibold tabular-nums">{locale === "es" ? "ES" : "EN"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 border-[color:var(--border-soft)] sm:size-9"
              aria-label={isDark ? t("themeToLight") : t("themeToDark")}
              disabled={!mounted}
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Moon className="size-3.5 sm:size-4" /> : <Sun className="size-3.5 sm:size-4" />}
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] px-3 pb-2 sm:px-4 md:px-6">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs text-[color:var(--muted-text)]">
            <span className="min-w-0 truncate font-[family-name:var(--font-display)] text-sm text-[color:var(--ink)]">
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
                  "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 text-[10px] font-medium sm:text-[11px]",
                  active ? "text-[color:var(--accent)]" : "text-[color:var(--muted-text)]"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="max-w-full truncate px-0.5">{t(link.shortKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

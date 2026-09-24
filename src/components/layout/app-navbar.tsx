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
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const percent = Math.round((completedCount / Math.max(ALL_EXERCISES.length, 1)) * 100);
  const isDark = mounted && resolvedTheme === "dark";
  const es = locale === "es";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 overflow-x-hidden border-b border-[color:var(--border-soft)] bg-[color:var(--surface)] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2 sm:px-4 md:px-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 border-[color:var(--border-soft)]"
            aria-label={menuOpen ? (es ? "Cerrar menú" : "Close menu") : es ? "Abrir menú" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Link href="/" className="flex min-w-0 shrink items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] sm:size-9 sm:rounded-2xl">
              <Coffee className="size-4 text-[color:var(--accent)]" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-[family-name:var(--font-display)] text-sm text-[color:var(--ink)] sm:text-base">
                SQL Coffee
              </p>
              <p className="hidden text-[10px] text-[color:var(--muted-text)] sm:block">Playground</p>
            </div>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div
              className="inline-flex h-8 items-center gap-1 rounded-full bg-[color:var(--cream)] px-2 text-xs text-[color:var(--ink)] sm:h-9 sm:px-2.5 sm:text-sm"
              title={es ? "Racha de días activos" : "Active day streak"}
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
              aria-label={es ? t("languageToEn") : t("languageToEs")}
              title={es ? t("languageToEn") : t("languageToEs")}
              onClick={toggleLocale}
            >
              <Languages className="size-3.5 sm:size-4" />
              <span className="text-xs font-semibold tabular-nums">{es ? "ES" : "EN"}</span>
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

      {/* Backdrop */}
      <button
        type="button"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-50 bg-black/25 transition-opacity",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMenuOpen(false)}
      />

      {/* Collapsible nav drawer */}
      <aside
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={es ? "Menú de navegación" : "Navigation menu"}
        className={cn(
          "fixed top-0 left-0 z-[60] flex h-dvh w-[min(18rem,88vw)] flex-col border-r border-[color:var(--border-soft)] bg-[color:var(--surface)] shadow-xl transition-transform duration-200 ease-out",
          menuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[color:var(--border-soft)] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)]">
              <Coffee className="size-4 text-[color:var(--accent)]" />
            </div>
            <div className="leading-tight">
              <p className="font-[family-name:var(--font-display)] text-base text-[color:var(--ink)]">
                SQL Coffee
              </p>
              <p className="text-[10px] text-[color:var(--muted-text)]">Playground</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            aria-label={es ? "Cerrar menú" : "Close menu"}
            onClick={() => setMenuOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Principal">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[color:var(--accent)] text-[color:var(--primary-foreground)] shadow-sm"
                    : "text-[color:var(--ink)]/85 hover:bg-[color:var(--cream)]"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        <p className="border-t border-[color:var(--border-soft)] p-4 text-xs leading-relaxed text-[color:var(--muted-text)]">
          {es ? (
            <>
              Lectura en <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>.
              Escritura solo en <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
            </>
          ) : (
            <>
              Read from <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>. Write
              only in <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
            </>
          )}
        </p>
      </aside>
    </>
  );
}

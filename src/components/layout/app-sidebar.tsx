"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Coffee,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { MessageKey } from "@/lib/i18n/messages";

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

function NavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className={cn("flex", compact ? "w-full" : "flex-col gap-1 p-3")} aria-label="Principal">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              compact
                ? "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium"
                : "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:min-h-0",
              active
                ? compact
                  ? "text-[color:var(--accent)]"
                  : "bg-[color:var(--accent)] text-[color:var(--primary-foreground)] shadow-sm"
                : compact
                  ? "text-[color:var(--muted-text)]"
                  : "text-[color:var(--ink)]/80 hover:bg-[color:var(--cream)]"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className={cn(compact && "truncate")}>
              {compact ? t(link.shortKey) : t(link.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)]">
        <Coffee className="size-5 text-[color:var(--accent)]" />
      </div>
      <div>
        <p className="font-[family-name:var(--font-display)] text-lg leading-tight text-[color:var(--ink)]">
          SQL Coffee
        </p>
        <p className="text-xs text-[color:var(--muted-text)]">Playground</p>
      </div>
    </div>
  );
}

function SidebarNote() {
  const { locale } = useLanguage();
  return (
    <div className="mt-auto p-4 text-xs leading-relaxed text-[color:var(--muted-text)]">
      {locale === "es" ? (
        <>
          Lectura en <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>. Escritura
          solo en <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
        </>
      ) : (
        <>
          Read from <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>. Write only
          in <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
        </>
      )}
    </div>
  );
}

export function AppSidebar() {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-[color:var(--border-soft)] bg-[color:var(--surface)] px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] lg:hidden">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-semibold text-[color:var(--ink)]">
          <Coffee className="size-5 text-[color:var(--accent)]" />
          SQL Coffee
        </Link>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-[color:var(--border-soft)] bg-[color:var(--surface)] pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Navegación móvil"
      >
        <NavLinks compact />
      </nav>
      <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-[color:var(--border-soft)] bg-[color:var(--surface)]/95 lg:flex lg:flex-col">
        <Brand />
        <NavLinks />
        <SidebarNote />
      </aside>
    </>
  );
}

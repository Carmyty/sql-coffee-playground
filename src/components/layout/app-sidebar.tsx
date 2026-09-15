"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Coffee,
  Compass,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", shortLabel: "Inicio", icon: LayoutDashboard },
  { href: "/learn", label: "Ruta de aprendizaje", shortLabel: "Ruta", icon: BookOpenText },
  { href: "/explore", label: "Explorar datos", shortLabel: "Datos", icon: Compass },
  { href: "/lab", label: "Laboratorio libre", shortLabel: "Lab", icon: FlaskConical },
  { href: "/lessons", label: "Mini lecciones", shortLabel: "Lecciones", icon: Coffee },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function NavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

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
                  ? "text-[color:var(--terracotta)]"
                  : "bg-[color:var(--coffee-mid)] text-white shadow-sm"
                : compact
                  ? "text-[color:var(--muted-text)]"
                  : "text-[color:var(--coffee-dark)]/80 hover:bg-[color:var(--cream)]"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className={cn(compact && "truncate")}>{compact ? link.shortLabel : link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--cream)]">
        <Coffee className="size-5 text-[color:var(--terracotta)]" />
      </div>
      <div>
        <p className="font-[family-name:var(--font-display)] text-lg leading-tight text-[color:var(--coffee-dark)]">
          SQL Coffee
        </p>
        <p className="text-xs text-[color:var(--muted-text)]">Playground</p>
      </div>
    </div>
  );
}

function SidebarNote() {
  return (
    <div className="mt-auto p-4 text-xs leading-relaxed text-[color:var(--muted-text)]">
      Lectura en <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>. Escritura solo en{" "}
      <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
    </div>
  );
}

export function AppSidebar() {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-[color:var(--cream)] bg-white px-3 py-2.5 lg:hidden pt-[max(0.625rem,env(safe-area-inset-top))]">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-semibold text-[color:var(--coffee-dark)]">
          <Coffee className="size-5 text-[color:var(--terracotta)]" />
          SQL Coffee
        </Link>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-[100] border-t border-[color:var(--cream)] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Navegación móvil"
      >
        <NavLinks compact />
      </nav>
      <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-[color:var(--cream)] bg-white/90 lg:flex lg:flex-col">
        <Brand />
        <NavLinks />
        <SidebarNote />
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Coffee,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Ruta de aprendizaje", icon: BookOpenText },
  { href: "/explore", label: "Explorar datos", icon: Compass },
  { href: "/lab", label: "Laboratorio libre", icon: FlaskConical },
  { href: "/lessons", label: "Mini lecciones", icon: Coffee },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Principal">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[color:var(--coffee-mid)] text-white shadow-sm"
                : "text-[color:var(--coffee-dark)]/80 hover:bg-[color:var(--cream)]"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-[color:var(--cream)] bg-white px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[color:var(--coffee-dark)]">
          <Coffee className="size-5 text-[color:var(--terracotta)]" />
          SQL Coffee
        </Link>
        <Button variant="outline" size="icon" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>
      {open ? <div className="border-b border-[color:var(--cream)] bg-white lg:hidden">{nav}</div> : null}
      <aside className="hidden w-64 shrink-0 border-r border-[color:var(--cream)] bg-white/90 lg:flex lg:flex-col">
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
        {nav}
        <div className="mt-auto p-4 text-xs leading-relaxed text-[color:var(--muted-text)]">
          Lectura en <code className="rounded bg-[color:var(--cream)] px-1">coffee_chain</code>. Escritura solo en{" "}
          <code className="rounded bg-[color:var(--cream)] px-1">sql_playground</code>.
        </div>
      </aside>
    </>
  );
}

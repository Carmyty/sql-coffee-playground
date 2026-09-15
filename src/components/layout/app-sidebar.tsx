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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Ruta de aprendizaje", icon: BookOpenText },
  { href: "/explore", label: "Explorar datos", icon: Compass },
  { href: "/lab", label: "Laboratorio libre", icon: FlaskConical },
  { href: "/lessons", label: "Mini lecciones", icon: Coffee },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Principal">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:min-h-0",
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    if (open) setOpen(false);
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-[color:var(--cream)] bg-white/95 px-3 py-2.5 backdrop-blur lg:hidden pt-[max(0.625rem,env(safe-area-inset-top))]">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-semibold text-[color:var(--coffee-dark)]">
          <Coffee className="size-5 text-[color:var(--terracotta)]" />
          SQL Coffee
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-11"
                aria-label="Abrir menú de navegación"
              />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(18.5rem,88vw)] bg-white p-0 pt-[env(safe-area-inset-top)]"
          >
            <SheetHeader className="border-b border-[color:var(--cream)] px-2 py-3">
              <SheetTitle className="px-3 text-left font-[family-name:var(--font-display)] text-lg text-[color:var(--coffee-dark)]">
                SQL Coffee
              </SheetTitle>
              <SheetDescription className="px-3 text-left">
                Navega por el playground
              </SheetDescription>
            </SheetHeader>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarNote />
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-[color:var(--cream)] bg-white/90 lg:flex lg:flex-col">
        <Brand />
        <NavLinks />
        <SidebarNote />
      </aside>
    </>
  );
}

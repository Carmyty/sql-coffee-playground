import { AppNavbar } from "@/components/layout/app-navbar";
import type { ReactNode } from "react";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-dvh bg-[color:var(--page-bg)] text-[color:var(--ink)]">
      <AppNavbar title={title} />
      <main className="mx-auto max-w-[1600px] px-3 py-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] sm:px-4 md:p-6 lg:pb-6">
        {children}
      </main>
    </div>
  );
}

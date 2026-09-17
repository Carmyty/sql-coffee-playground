import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import type { ReactNode } from "react";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-dvh bg-[color:var(--page-bg)] text-[color:var(--ink)]">
      <div className="mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:flex-row">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-16 lg:pb-0">
          <AppTopbar title={title} />
          <main className="flex-1 px-3 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

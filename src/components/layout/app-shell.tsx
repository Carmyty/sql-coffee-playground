import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import type { ReactNode } from "react";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="h-dvh overflow-hidden bg-[color:var(--page-bg)] text-[color:var(--coffee-dark)]">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col lg:flex-row">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppTopbar title={title} />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-clip overscroll-y-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

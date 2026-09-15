import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import type { ReactNode } from "react";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] text-[color:var(--coffee-dark)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar title={title} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

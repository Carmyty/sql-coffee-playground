"use client";

import { useEffect, useState } from "react";
import { ResultsTable } from "@/components/exercise/results-table";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

type PreviewPayload = {
  ok?: boolean;
  table?: { columns?: Array<{ name: string }> };
  rows?: Record<string, unknown>[];
};

type ReferenceTablesProps = {
  tables: string[];
  embedded?: boolean;
};

export function ReferenceTables({ tables, embedded = false }: ReferenceTablesProps) {
  const { locale } = useLanguage();
  const es = locale === "es";
  const [previews, setPreviews] = useState<
    Record<string, { columns: Array<{ name: string }>; rows: Record<string, unknown>[] }>
  >({});

  useEffect(() => {
    let cancelled = false;
    const unique = Array.from(new Set(tables)).slice(0, 2);

    Promise.all(
      unique.map(async (table) => {
        try {
          const res = await fetch(`/api/schema/${encodeURIComponent(table)}`);
          const data = (await res.json()) as PreviewPayload;
          const columns = data.table?.columns;
          if (!columns?.length) return [table, null] as const;
          return [
            table,
            {
              columns,
              rows: (data.rows || []).slice(0, 8),
            },
          ] as const;
        } catch {
          return [table, null] as const;
        }
      })
    ).then((entries) => {
      if (cancelled) return;
      const next: typeof previews = {};
      for (const [table, payload] of entries) {
        if (payload) next[table] = payload;
      }
      setPreviews(next);
    });

    return () => {
      cancelled = true;
    };
  }, [tables]);

  const names = Object.keys(previews);
  if (names.length === 0) {
    return (
      <div
        className={cn(
          "h-[140px] bg-[color:var(--surface)]",
          !embedded && "rounded-xl border border-dashed border-[color:var(--border-soft)]"
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid w-full min-w-0 gap-0",
        names.length > 1 && "md:grid-cols-2 md:divide-x md:divide-[color:var(--border-soft)]",
        embedded ? "bg-[color:var(--surface)]" : "gap-3"
      )}
    >
      {names.map((table) => {
        const preview = previews[table];
        return (
          <section
            key={table}
            className={cn(
              "flex h-[140px] min-w-0 flex-col overflow-hidden p-3 sm:h-[150px]",
              embedded
                ? "bg-[color:var(--surface)]"
                : "rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)]"
            )}
          >
            <p className="mb-2 shrink-0 truncate text-sm font-semibold text-[color:var(--ink)]">
              {es ? "Tabla" : "Table"}: {table}
            </p>
            <div className="min-h-0 min-w-0 flex-1 overflow-auto rounded-lg border border-[color:var(--border-soft)]">
              <ResultsTable columns={preview.columns} rows={preview.rows} compact />
            </div>
          </section>
        );
      })}
    </div>
  );
}

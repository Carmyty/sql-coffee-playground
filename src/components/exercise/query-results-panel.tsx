"use client";

import { ResultsTable } from "@/components/exercise/results-table";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { CheckCircle2, Loader2, Table2 } from "lucide-react";

type TablePayload = {
  columns: Array<{ name: string }>;
  rows: Record<string, unknown>[];
  rowCount?: number;
  executionMs?: number;
};

type QueryResultsPanelProps = {
  title?: string;
  live?: TablePayload | null;
  liveError?: string | null;
  liveBusy?: boolean;
  matched?: boolean;
};

export function QueryResultsPanel({
  title,
  live,
  liveError,
  liveBusy,
  matched,
}: QueryResultsPanelProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";
  const heading = title || (es ? "Resultados de la consulta" : "Query Results");

  return (
    <section
      className={cn(
        "flex h-[280px] flex-col rounded-xl border p-3 sm:h-[300px] sm:p-4",
        matched
          ? "border-[color:var(--success)]/50 bg-[color:var(--success-soft)]"
          : "border-[color:var(--border-soft)] bg-[color:var(--surface)]"
      )}
    >
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--ink)]">
          <Table2 className="size-4 text-[color:var(--accent)]" />
          {heading}
        </p>
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted-text)]">
          {liveBusy ? <Loader2 className="size-3.5 animate-spin" /> : null}
          {live && !liveError ? (
            <span>
              {live.rowCount ?? live.rows.length} {t("rows")}
              {live.executionMs !== undefined ? ` · ${live.executionMs} ms` : ""}
            </span>
          ) : null}
          {matched ? (
            <span className="inline-flex items-center gap-1 font-medium text-[color:var(--success)]">
              <CheckCircle2 className="size-3.5 check-burst" />
              {es ? "¡Correcto!" : "Correct!"}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface)]">
        {liveError ? (
          <p className="p-3 text-sm text-[color:var(--danger)]">{liveError}</p>
        ) : live && live.columns.length > 0 ? (
          <ResultsTable columns={live.columns} rows={live.rows} pageSize={50} compact />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-sm text-[color:var(--muted-text)]">
            —
          </div>
        )}
      </div>
    </section>
  );
}

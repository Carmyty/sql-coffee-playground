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
  emptyHint?: string;
};

export function QueryResultsPanel({
  title,
  live,
  liveError,
  liveBusy,
  matched,
  emptyHint,
}: QueryResultsPanelProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";
  const heading = title || (es ? "Resultados de la consulta" : "Query Results");

  return (
    <section
      className={cn(
        "space-y-2 rounded-xl border p-3 transition-colors duration-300 sm:p-4",
        matched
          ? "border-[color:var(--success)]/50 bg-[color:var(--success-soft)]"
          : "border-[color:var(--border-soft)] bg-[color:var(--surface)]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--ink)]">
          <Table2 className="size-4 text-[color:var(--accent)]" />
          {heading}
        </p>
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted-text)]">
          {liveBusy ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="size-3.5 animate-spin" />
              {es ? "En vivo…" : "Live…"}
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

      {liveError ? (
        <p className="rounded-lg border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 p-3 text-sm text-[color:var(--danger)]">
          {liveError}
        </p>
      ) : live && live.columns.length > 0 ? (
        <>
          <p className="text-xs text-[color:var(--muted-text)]">
            {live.rowCount ?? live.rows.length} {t("rows")}
            {live.executionMs !== undefined ? ` · ${live.executionMs} ms` : ""}
          </p>
          <ResultsTable columns={live.columns} rows={live.rows} pageSize={8} />
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-[color:var(--border-soft)] p-4 text-sm text-[color:var(--muted-text)]">
          {emptyHint ||
            (es
              ? "Escribe un SELECT: la tabla se actualiza sola, sin pulsar ningún botón."
              : "Type a SELECT: the table updates by itself—no button to press.")}
        </p>
      )}
    </section>
  );
}

"use client";

import { ResultsTable } from "@/components/exercise/results-table";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { CheckCircle2, Table2 } from "lucide-react";

type TablePayload = {
  columns: Array<{ name: string }>;
  rows: Record<string, unknown>[];
  rowCount?: number;
  executionMs?: number;
};

type LiveResultPanelsProps = {
  expected?: TablePayload | null;
  expectedDescription?: string;
  live?: TablePayload | null;
  liveError?: string | null;
  liveBusy?: boolean;
  matched?: boolean;
};

export function LiveResultPanels({
  expected,
  expectedDescription,
  live,
  liveError,
  liveBusy,
  matched,
}: LiveResultPanelsProps) {
  const { locale, t } = useLanguage();
  const es = locale === "es";

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <section
        className={cn(
          "space-y-2 rounded-2xl border p-4",
          matched
            ? "border-[color:var(--success)]/50 bg-[color:var(--success-soft)]"
            : "border-[color:var(--border-soft)] bg-[color:var(--surface)]"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[color:var(--ink)]">
            <Table2 className="size-4 text-[color:var(--accent)]" />
            {es ? "Tu resultado (en vivo)" : "Your result (live)"}
          </p>
          {matched ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--success)]">
              <CheckCircle2 className="size-3.5" />
              {es ? "Coincide" : "Match"}
            </span>
          ) : null}
        </div>
        {liveBusy ? (
          <p className="text-sm text-[color:var(--muted-text)]">
            {es ? "Ejecutando…" : "Running…"}
          </p>
        ) : liveError ? (
          <p className="rounded-xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 p-3 text-sm text-[color:var(--danger)]">
            {liveError}
          </p>
        ) : live && live.columns.length > 0 ? (
          <>
            <p className="text-xs text-[color:var(--muted-text)]">
              {live.rowCount ?? live.rows.length} {t("rows")}
              {live.executionMs !== undefined ? ` · ${live.executionMs} ms` : ""}
            </p>
            <ResultsTable columns={live.columns} rows={live.rows} pageSize={6} />
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-[color:var(--border-soft)] p-4 text-sm text-[color:var(--muted-text)]">
            {es
              ? "Escribe un SELECT y verás aquí la tabla al instante (estilo SQLBolt)."
              : "Write a SELECT and you will see the table here instantly (SQLBolt-style)."}
          </p>
        )}
      </section>

      <section className="space-y-2 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--accent-soft)]/40 p-4">
        <p className="text-sm font-semibold text-[color:var(--ink)]">
          {es ? "Resultado esperado" : "Expected result"}
        </p>
        {expectedDescription ? (
          <p className="text-sm text-[color:var(--muted-text)]">{expectedDescription}</p>
        ) : null}
        {expected && expected.columns.length > 0 ? (
          <ResultsTable columns={expected.columns} rows={expected.rows} pageSize={6} />
        ) : (
          <p className="rounded-xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--muted-text)]">
            {es
              ? "Este ejercicio se valida por efecto (sandbox) o aún no hay vista previa tabular."
              : "This exercise is validated by effect (sandbox) or has no tabular preview yet."}
          </p>
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "sql-formatter";
import { AppShell } from "@/components/layout/app-shell";
import { SqlEditor } from "@/components/editor/sql-editor";
import { ResultsTable } from "@/components/exercise/results-table";
import { AccuracyBar } from "@/components/exercise/accuracy-bar";
import { scoreLiveAccuracy } from "@/lib/live-accuracy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eraser, Play, Sparkles, Star } from "lucide-react";

type HistoryItem = { id: string; sql: string; at: string; favorite?: boolean };

const HISTORY_KEY = "sql-coffee-lab-history-v1";

export default function LabPage() {
  const [sql, setSql] = useState("SELECT name, city FROM stores LIMIT 10;");
  const [mode, setMode] = useState<"read" | "sandbox">("read");
  const [schemaMap, setSchemaMap] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    rows: Record<string, unknown>[];
    columns: Array<{ name: string }>;
    rowCount: number;
    executionMs: number;
    schema: string;
    warning?: { message: string; requiresConfirm: boolean };
    error?: { message: string; beginnerHint: string };
  } | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    } catch {
      return [];
    }
  });
  const [explainText, setExplainText] = useState<string | null>(null);
  const [improveTips, setImproveTips] = useState<string[]>([]);

  const accuracy = useMemo(
    () =>
      scoreLiveAccuracy(sql, {
        environment: mode,
        suggestedTables: [],
        concepts: [],
        validation: {
          requiredKeywords: mode === "read" ? ["select", "from"] : [],
          matchMode: "exists",
        },
      }),
    [sql, mode]
  );
  useEffect(() => {
    fetch("/api/schema")
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok || !data.graph) return;
        const map: Record<string, string[]> = {};
        for (const table of data.graph.tables) {
          map[table.name] = table.columns.map((column: { name: string }) => column.name);
        }
        setSchemaMap(map);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 40)));
  }, [history]);

  async function runQuery(confirmMutation = false) {
    setBusy(true);
    setExplainText(null);
    try {
      const response = await fetch("/api/sql/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql, mode, confirmMutation }),
      });
      const data = await response.json();
      setResult(data);
      if (data.warning?.requiresConfirm) {
        setPendingConfirm(true);
        return;
      }
      setPendingConfirm(false);
      if (data.ok) {
        setHistory((prev) => [
          { id: `${Date.now()}`, sql, at: new Date().toISOString() },
          ...prev.filter((item) => item.sql !== sql),
        ]);
      }
    } finally {
      setBusy(false);
    }
  }

  async function explain() {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql, kind: "explain" }),
    });
    const data = await response.json();
    const clauses = (data.clauses || [])
      .map((item: { title: string; text: string }) => `${item.title}: ${item.text}`)
      .join("\n");
    setExplainText(`${data.summary || ""}\n${clauses}`.trim());
  }

  async function improve() {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql, kind: "hint" }),
    });
    const data = await response.json();
    setImproveTips((data.clauses || []).map((item: { text: string }) => item.text));
  }

  function toggleFavorite(id: string) {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  }

  return (
    <AppShell title="Laboratorio libre">
      <div className="animate-fade-up grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="max-w-full whitespace-normal bg-[color:var(--coffee-mid)] text-white hover:bg-[color:var(--coffee-mid)]">
              {mode === "read" ? "Lectura: coffee_chain" : "Práctica segura: sql_playground"}
            </Badge>
            <Button variant={mode === "read" ? "default" : "outline"} size="sm" onClick={() => setMode("read")}>
              Lectura
            </Button>
            <Button
              variant={mode === "sandbox" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("sandbox")}
            >
              Sandbox
            </Button>
          </div>

          <AccuracyBar accuracy={accuracy} />
          <SqlEditor value={sql} onChange={setSql} schema={schemaMap} height="320px" />

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button className="max-sm:w-full" onClick={() => runQuery(false)} disabled={busy}>
              <Play className="size-4" />
              Ejecutar
            </Button>
            {pendingConfirm ? (
              <Button variant="destructive" className="max-sm:w-full" onClick={() => runQuery(true)} disabled={busy}>
                Confirmar modificación
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="max-sm:w-full"
              onClick={() => {
                try {
                  setSql(format(sql, { language: "postgresql" }));
                } catch {
                  setExplainText("No se pudo formatear la consulta.");
                }
              }}
            >
              Formatear
            </Button>
            <Button variant="outline" className="max-sm:w-full" onClick={() => setSql("")}>
              <Eraser className="size-4" />
              Limpiar
            </Button>
            <Button variant="secondary" className="max-sm:w-full" onClick={explain}>
              <Sparkles className="size-4" />
              Explícame esta consulta
            </Button>
            <Button variant="secondary" className="max-sm:w-full" onClick={improve}>
              Dame una pista para mejorarla
            </Button>
          </div>

          {explainText ? (
            <Alert>
              <AlertTitle>Explicación</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{explainText}</AlertDescription>
            </Alert>
          ) : null}

          {improveTips.length > 0 ? (
            <Alert>
              <AlertTitle>Pistas de mejora (sin reescribir tu query)</AlertTitle>
              <AlertDescription>
                <ul className="list-disc space-y-1 pl-4">
                  {improveTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          {result?.error ? (
            <Alert variant="destructive">
              <AlertTitle>Error explicado</AlertTitle>
              <AlertDescription>
                <p className="font-medium">{result.error.beginnerHint}</p>
                <p className="mt-1 font-mono text-xs opacity-80">{result.error.message}</p>
              </AlertDescription>
            </Alert>
          ) : null}

          {result?.warning ? (
            <Alert>
              <AlertTitle>Advertencia</AlertTitle>
              <AlertDescription>{result.warning.message}</AlertDescription>
            </Alert>
          ) : null}

          {result && !result.error && !result.warning?.requiresConfirm ? (
            <div className="space-y-2">
              <p className="text-sm text-[color:var(--muted-text)]">
                {result.rowCount} filas · {result.executionMs} ms · {result.schema}
              </p>
              <ResultsTable columns={result.columns} rows={result.rows} />
            </div>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Historial local</CardTitle>
            <CardDescription>Consultas y favoritos guardados en este navegador.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm text-[color:var(--muted-text)]">Todavía no hay historial.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-xl border border-[color:var(--cream)] p-2 text-xs">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <button className="underline" onClick={() => setSql(item.sql)}>
                      Cargar
                    </button>
                    <button onClick={() => toggleFavorite(item.id)} aria-label="Marcar favorito">
                      <Star
                        className={`size-4 ${item.favorite ? "fill-[color:var(--terracotta)] text-[color:var(--terracotta)]" : ""}`}
                      />
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words">{item.sql}</pre>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

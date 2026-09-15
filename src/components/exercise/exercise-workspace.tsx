"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "sql-formatter";
import {
  AlertTriangle,
  CheckCircle2,
  Eraser,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Table2,
} from "lucide-react";
import type { Exercise } from "@/data/types";
import { getNextExercise, getPreviousExercise } from "@/data/exercises";
import { scoreLiveAccuracy } from "@/lib/live-accuracy";
import { AccuracyBar } from "@/components/exercise/accuracy-bar";
import { SqlEditor } from "@/components/editor/sql-editor";
import { ResultsTable } from "@/components/exercise/results-table";
import { useProgress } from "@/hooks/use-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SchemaPayload = {
  ok: boolean;
  graph?: {
    tables: Array<{ name: string; columns: Array<{ name: string }> }>;
  };
};

type ExecuteResponse = {
  ok: boolean;
  environment: "read" | "sandbox";
  schema: string;
  rows: Record<string, unknown>[];
  columns: Array<{ name: string }>;
  rowCount: number;
  executionMs: number;
  warning?: { message: string; estimatedRows?: number; requiresConfirm: boolean };
  error?: { message: string; beginnerHint: string };
};

type ValidateResponse = {
  ok: boolean;
  execution?: ExecuteResponse;
  validation?: {
    status: "correct" | "partial" | "incorrect" | "error";
    message: string;
    explanation: string;
    nearMiss: boolean;
  };
  solutionUnlocked?: boolean;
  reference?: {
    sql: string;
    explanation: Array<{ clause: string; text: string }>;
  };
  error?: string;
};

export function ExerciseWorkspace({ exercise }: { exercise: Exercise }) {
  const { getExercise, recordVisit, recordAttempt, unlockSolution, setHintsUsed } = useProgress();
  const progress = getExercise(exercise.id);
  const [sql, setSql] = useState(progress.lastSql || exercise.starterSql);
  const [hintLevel, setHintLevel] = useState(progress.hintsUsed);
  const [schemaMap, setSchemaMap] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [validation, setValidation] = useState<ValidateResponse["validation"]>();
  const [reference, setReference] = useState<ValidateResponse["reference"]>();
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [explainText, setExplainText] = useState<string | null>(null);

  const accuracy = useMemo(() => scoreLiveAccuracy(sql, exercise), [sql, exercise]);
  const previous = getPreviousExercise(exercise.id);
  const next = getNextExercise(exercise.id);
  const envLabel =
    exercise.environment === "read" ? "Lectura: coffee_chain" : "Práctica segura: sql_playground";
  const solutionReady =
    progress.solutionUnlocked ||
    progress.attempts >= exercise.unlockAfterAttempts ||
    Boolean(reference);

  useEffect(() => {
    recordVisit(exercise.id, sql);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    fetch("/api/schema")
      .then((res) => res.json())
      .then((data: SchemaPayload) => {
        if (!data.ok || !data.graph) return;
        const map: Record<string, string[]> = {};
        for (const table of data.graph.tables) {
          map[table.name] = table.columns.map((column) => column.name);
        }
        setSchemaMap(map);
      })
      .catch(() => undefined);
  }, []);

  async function runQuery(confirmMutation = false) {
    setBusy(true);
    setExplainText(null);
    try {
      const response = await fetch("/api/exercise/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          sql,
          confirmMutation,
          unlockSolution: progress.solutionUnlocked,
        }),
      });
      const data = (await response.json()) as ValidateResponse;
      if (!data.ok) {
        setResult({
          ok: false,
          environment: exercise.environment,
          schema: exercise.environment === "read" ? "coffee_chain" : "sql_playground",
          rows: [],
          columns: [],
          rowCount: 0,
          executionMs: 0,
          error: {
            message: data.error || "Error",
            beginnerHint: "Revisa la consulta e inténtalo de nuevo.",
          },
        });
        return;
      }

      if (data.execution?.warning?.requiresConfirm) {
        setResult(data.execution);
        setPendingConfirm(true);
        setValidation(undefined);
        return;
      }

      setPendingConfirm(false);
      setResult(data.execution || null);
      setValidation(data.validation);
      if (data.reference) setReference(data.reference);

      const status =
        data.validation?.status === "correct"
          ? "correct"
          : data.validation?.status === "partial"
            ? "partial"
            : data.execution?.error
              ? "error"
              : "incorrect";

      recordAttempt({
        exerciseId: exercise.id,
        sql,
        status,
        hintsUsed: hintLevel,
        unlockSolution: data.solutionUnlocked,
      });
    } finally {
      setBusy(false);
    }
  }

  async function resetSandbox() {
    setBusy(true);
    try {
      await fetch("/api/sandbox/reset", { method: "POST" });
      setResult(null);
      setValidation(undefined);
      setExplainText("Sandbox restablecido a su estado inicial.");
    } finally {
      setBusy(false);
    }
  }

  async function explainQuery() {
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

  function revealHint() {
    const nextLevel = Math.min(3, hintLevel + 1);
    setHintLevel(nextLevel);
    setHintsUsed(exercise.id, nextLevel);
  }

  function formatSql() {
    try {
      setSql(format(sql, { language: "postgresql" }));
    } catch {
      setExplainText("No se pudo formatear: revisa la sintaxis básica.");
    }
  }

  function requestSolution() {
    unlockSolution(exercise.id);
    setReference({
      sql: exercise.referenceSql,
      explanation: exercise.referenceExplanation,
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_minmax(280px,360px)]">
      <Card className="h-fit border-[color:var(--cream)] bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{exercise.difficulty}</Badge>
            <Badge variant="outline">{exercise.estimatedMinutes} min</Badge>
          </div>
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--coffee-dark)]">
            {exercise.title}
          </CardTitle>
          <CardDescription>{exercise.objective}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="mb-1 font-medium">Resultado esperado (en palabras)</p>
            <p className="text-[color:var(--muted-text)]">{exercise.expectedResult}</p>
          </div>
          <div>
            <p className="mb-1 font-medium">Tablas sugeridas</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.suggestedTables.map((table) => (
                <Badge key={table} variant="outline">
                  {table}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium">Conceptos</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.concepts.map((concept) => (
                <Badge key={concept}>{concept}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 font-medium">Checklist de razonamiento</p>
            <ul className="list-disc space-y-1 pl-5 text-[color:var(--muted-text)]">
              {exercise.reasoningChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={revealHint} disabled={hintLevel >= 3}>
              <Lightbulb className="size-4" />
              Pedir pista {hintLevel}/3
            </Button>
            {hintLevel >= 1 ? (
              <Alert>
                <AlertTitle>Pista 1</AlertTitle>
                <AlertDescription>{exercise.hints[0]}</AlertDescription>
              </Alert>
            ) : null}
            {hintLevel >= 2 ? (
              <Alert>
                <AlertTitle>Pista 2</AlertTitle>
                <AlertDescription className="font-mono text-xs">{exercise.hints[1]}</AlertDescription>
              </Alert>
            ) : null}
            {hintLevel >= 3 ? (
              <Alert>
                <AlertTitle>Pista 3</AlertTitle>
                <AlertDescription>{exercise.hints[2]}</AlertDescription>
              </Alert>
            ) : null}
          </div>
          <div className="flex gap-2">
            {previous ? (
              <Link
                href={`/learn/${previous.moduleId}/${previous.id}`}
                className="inline-flex h-8 flex-1 items-center justify-center rounded-lg text-sm hover:bg-muted"
              >
                Anterior
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/learn/${next.moduleId}/${next.id}`}
                className="inline-flex h-8 flex-1 items-center justify-center rounded-lg text-sm hover:bg-muted"
              >
                Siguiente
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-[color:var(--coffee-mid)] text-white hover:bg-[color:var(--coffee-mid)]">
            {envLabel}
          </Badge>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={formatSql}>
              Formatear
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSql(exercise.starterSql)}>
              <Eraser className="size-4" />
              Limpiar
            </Button>
            <Link
              href="/explore"
              className="inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-sm"
            >
              <Table2 className="size-4" />
              Ver esquema
            </Link>
            {exercise.environment === "sandbox" ? (
              <Button variant="outline" size="sm" onClick={resetSandbox} disabled={busy}>
                <RotateCcw className="size-4" />
                Reiniciar sandbox
              </Button>
            ) : null}
          </div>
        </div>

        <AccuracyBar accuracy={accuracy} />
        <SqlEditor value={sql} onChange={setSql} schema={schemaMap} height="320px" />

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => runQuery(false)} disabled={busy}>
            <Play className="size-4" />
            Ejecutar consulta
          </Button>
          {pendingConfirm ? (
            <Button variant="destructive" onClick={() => runQuery(true)} disabled={busy}>
              <AlertTriangle className="size-4" />
              Confirmar modificación
            </Button>
          ) : null}
          <Button variant="secondary" onClick={explainQuery} disabled={!sql.trim()}>
            <Sparkles className="size-4" />
            Explícame esta consulta
          </Button>
        </div>

        {explainText ? (
          <Alert>
            <AlertTitle>Explicación</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">{explainText}</AlertDescription>
          </Alert>
        ) : null}

        {result?.warning ? (
          <Alert>
            <AlertTriangle className="size-4" />
            <AlertTitle>Advertencia de impacto</AlertTitle>
            <AlertDescription>
              {result.warning.message}
              {result.warning.estimatedRows !== undefined
                ? ` Filas estimadas: ${result.warning.estimatedRows}.`
                : ""}
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

        {result && !result.error ? (
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--muted-text)]">
              {result.rowCount} filas · {result.executionMs} ms · entorno {result.schema}
            </p>
            <ResultsTable columns={result.columns} rows={result.rows} />
          </div>
        ) : null}
      </div>

      <Card className="h-fit border-[color:var(--cream)] bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Validación y solución</CardTitle>
          <CardDescription>
            Intentos: {progress.attempts}. La solución se desbloquea tras {exercise.unlockAfterAttempts}{" "}
            intentos o si la pides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {validation ? (
            <Alert>
              {validation.status === "correct" ? <CheckCircle2 className="size-4" /> : null}
              <AlertTitle>{validation.message}</AlertTitle>
              <AlertDescription>{validation.explanation}</AlertDescription>
            </Alert>
          ) : (
            <p className="text-[color:var(--muted-text)]">
              Ejecuta tu consulta para recibir feedback. Aceptamos enfoques distintos si el resultado
              cumple el objetivo.
            </p>
          )}

          {!solutionReady ? (
            <Button variant="outline" className="w-full" onClick={requestSolution}>
              Quiero ver la solución
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="font-medium">Solución de referencia (una de varias posibles)</p>
              <pre className="overflow-auto rounded-lg bg-[color:var(--coffee-dark)] p-3 text-xs text-[color:var(--cream)]">
                {(reference?.sql || exercise.referenceSql).trim()}
              </pre>
              <ul className="space-y-2">
                {(reference?.explanation || exercise.referenceExplanation).map((item) => (
                  <li key={item.clause} className="rounded-lg bg-[color:var(--cream)]/60 p-2">
                    <p className="font-medium">{item.clause}</p>
                    <p className="text-[color:var(--muted-text)]">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

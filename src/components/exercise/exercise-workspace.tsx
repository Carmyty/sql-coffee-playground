"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format } from "sql-formatter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Lightbulb,
  List,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Exercise } from "@/data/types";
import { getModuleExercises, getNextExercise, getPreviousExercise } from "@/data/exercises";
import { LEARNING_MODULES } from "@/data/modules";
import { localizeExercise } from "@/lib/i18n/exercises-en";
import { localizeModule } from "@/lib/i18n/modules-en";
import { CompletionBanner } from "@/components/exercise/completion-banner";
import { QueryResultsPanel } from "@/components/exercise/query-results-panel";
import { ReferenceTables } from "@/components/exercise/reference-tables";
import { TasksSidebar, type TaskItem } from "@/components/exercise/tasks-sidebar";
import { SqlEditor } from "@/components/editor/sql-editor";
import { useProgress } from "@/hooks/use-progress";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { isLikelySelect } from "@/lib/tsql/translate";

const TASK_WINDOW = 4;

function initialSql(raw: string | undefined, starter: string) {
  const value = (raw ?? starter ?? "").trim();
  const withoutComments = value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--[^\n]*/g, "")
    .trim();
  return withoutComments ? value : "";
}

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
  const { locale, t } = useLanguage();
  const { getExercise, recordVisit, recordAttempt, unlockSolution, setHintsUsed } = useProgress();

  const taskChain = useMemo(() => {
    const moduleExercises = getModuleExercises(exercise.moduleId);
    const start = moduleExercises.findIndex((item) => item.id === exercise.id);
    const from = start >= 0 ? start : 0;
    return moduleExercises.slice(from, from + TASK_WINDOW);
  }, [exercise.id, exercise.moduleId]);

  const [activeTaskId, setActiveTaskId] = useState(exercise.id);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  const activeExercise = useMemo(
    () => taskChain.find((item) => item.id === activeTaskId) || exercise,
    [taskChain, activeTaskId, exercise]
  );
  const localized = useMemo(
    () => localizeExercise(activeExercise, locale),
    [activeExercise, locale]
  );
  const progress = getExercise(activeExercise.id);

  const [sql, setSql] = useState(() => initialSql(progress.lastSql, activeExercise.starterSql));
  const [hintLevel, setHintLevel] = useState(progress.hintsUsed);
  const [schemaMap, setSchemaMap] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [validation, setValidation] = useState<ValidateResponse["validation"]>();
  const [reference, setReference] = useState<ValidateResponse["reference"]>();
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [explainText, setExplainText] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showHintsPanel, setShowHintsPanel] = useState(false);
  const [liveResult, setLiveResult] = useState<ExecuteResponse | null>(null);
  const [liveBusy, setLiveBusy] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const lastRecordedKey = useRef<string>("");
  const celebratedIds = useRef<Set<string>>(new Set());

  const previous = getPreviousExercise(exercise.id);
  const afterChain = getNextExercise(taskChain[taskChain.length - 1]?.id || exercise.id);
  const previousLocalized = previous ? localizeExercise(previous, locale) : undefined;
  const learningModule = LEARNING_MODULES.find((module) => module.id === exercise.moduleId);
  const moduleTitle = learningModule
    ? localizeModule(learningModule, locale).title
    : t("pageLearn");

  const envLabel =
    activeExercise.environment === "read"
      ? `${t("envRead")} · T-SQL`
      : `${t("envSandbox")} · T-SQL`;
  const solutionReady =
    progress.solutionUnlocked ||
    progress.attempts >= activeExercise.unlockAfterAttempts ||
    Boolean(reference);
  const isCorrect =
    validation?.status === "correct" ||
    completedIds.has(activeExercise.id) ||
    progress.status === "correct";
  const isRead = activeExercise.environment === "read";
  const allTasksDone = taskChain.every(
    (item) => completedIds.has(item.id) || getExercise(item.id).status === "correct"
  );
  const difficultyLabel =
    activeExercise.difficulty === "basico"
      ? t("difficultyBasico")
      : activeExercise.difficulty === "intermedio"
        ? t("difficultyIntermedio")
        : t("difficultyAvanzado");

  const tasks: TaskItem[] = useMemo(() => {
    const firstOpenIndex = taskChain.findIndex(
      (item) => !(completedIds.has(item.id) || getExercise(item.id).status === "correct")
    );
    const activeIndex = taskChain.findIndex((item) => item.id === activeTaskId);
    return taskChain.map((item, index) => {
      const done = completedIds.has(item.id) || getExercise(item.id).status === "correct";
      const localizedItem = localizeExercise(item, locale);
      // Prefer short titles in the list; full objective only for the active task.
      const label =
        item.id === activeTaskId || (!done && index === firstOpenIndex)
          ? localizedItem.objective
          : localizedItem.title;
      if (done) {
        return { id: item.id, label: localizedItem.title, state: "done" as const };
      }
      if (item.id === activeTaskId) {
        return { id: item.id, label, state: "active" as const };
      }
      const gate = activeIndex >= 0 ? activeIndex : firstOpenIndex;
      if (gate >= 0 && index > gate) {
        return { id: item.id, label: localizedItem.title, state: "locked" as const };
      }
      return { id: item.id, label: localizedItem.title, state: "locked" as const };
    });
  }, [taskChain, completedIds, activeTaskId, locale, getExercise]);

  useEffect(() => {
    const seed = new Set<string>();
    for (const item of taskChain) {
      if (getExercise(item.id).status === "correct") seed.add(item.id);
    }
    setCompletedIds(seed);
    const firstOpen = taskChain.find((item) => !seed.has(item.id));
    setActiveTaskId(firstOpen?.id || exercise.id);
    celebratedIds.current = new Set(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    const p = getExercise(activeExercise.id);
    setSql(initialSql(p.lastSql, activeExercise.starterSql));
    setHintLevel(p.hintsUsed);
    setShowCompletion(false);
    setValidation(undefined);
    setResult(null);
    setReference(undefined);
    setExplainText(null);
    setPendingConfirm(false);
    setLiveResult(null);
    setLiveError(null);
    setShowHintsPanel(false);
    lastRecordedKey.current = "";
    recordVisit(activeExercise.id, initialSql(p.lastSql, activeExercise.starterSql));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExercise.id]);

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

  useEffect(() => {
    if (!isRead) return;
    const trimmed = sql.trim();
    if (!trimmed || trimmed.length < 8 || !isLikelySelect(trimmed)) {
      setLiveResult(null);
      setLiveError(null);
      setLiveBusy(false);
      return;
    }

    let cancelled = false;
    setLiveBusy(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/exercise/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exerciseId: activeExercise.id,
            sql: trimmed,
            confirmMutation: false,
            unlockSolution: progress.solutionUnlocked,
          }),
        });
        const data = (await response.json()) as ValidateResponse;
        if (cancelled) return;

        if (!data.ok) {
          setLiveError(data.error || t("reviewQuery"));
          setLiveResult(null);
          return;
        }

        const execution = data.execution || null;
        if (execution?.error) {
          setLiveError(execution.error.beginnerHint || execution.error.message);
          setLiveResult(null);
          setValidation(data.validation);
        } else {
          setLiveError(null);
          setLiveResult(execution);
          setResult(execution);
          setValidation(data.validation);
        }

        if (data.reference) setReference(data.reference);

        const status =
          data.validation?.status === "correct"
            ? "correct"
            : data.validation?.status === "partial"
              ? "partial"
              : execution?.error
                ? "error"
                : "incorrect";

        const recordKey = `${activeExercise.id}::${trimmed}`;
        if (recordKey !== lastRecordedKey.current) {
          lastRecordedKey.current = recordKey;
          recordAttempt({
            exerciseId: activeExercise.id,
            sql: trimmed,
            status,
            hintsUsed: hintLevel,
            unlockSolution: data.solutionUnlocked,
          });
        }

        if (status === "correct") {
          const solvedId = activeExercise.id;
          const idx = taskChain.findIndex((item) => item.id === solvedId);
          setCompletedIds((prev) => {
            const next = new Set(prev);
            next.add(solvedId);
            const following = taskChain
              .slice(idx + 1)
              .find((item) => !next.has(item.id) && getExercise(item.id).status !== "correct");
            if (following) {
              window.setTimeout(() => setActiveTaskId(following.id), 650);
            }
            return next;
          });
          if (!celebratedIds.current.has(solvedId)) {
            celebratedIds.current.add(solvedId);
            setShowCompletion(true);
          }
        }
      } catch {
        if (!cancelled) {
          setLiveError(locale === "en" ? "Could not run query." : "No se pudo ejecutar la consulta.");
        }
      } finally {
        if (!cancelled) setLiveBusy(false);
      }
    }, 480);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sql, isRead, activeExercise.id, locale, hintLevel, progress.solutionUnlocked, recordAttempt, t]);

  async function runQuery(confirmMutation = false) {
    setBusy(true);
    setExplainText(null);
    try {
      const response = await fetch("/api/exercise/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: activeExercise.id,
          sql,
          confirmMutation,
          unlockSolution: progress.solutionUnlocked,
        }),
      });
      const data = (await response.json()) as ValidateResponse;
      if (!data.ok) {
        setResult({
          ok: false,
          environment: activeExercise.environment,
          schema: activeExercise.environment === "read" ? "coffee_chain" : "sql_playground",
          rows: [],
          columns: [],
          rowCount: 0,
          executionMs: 0,
          error: {
            message: data.error || "Error",
            beginnerHint: t("reviewQuery"),
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
      setLiveResult(data.execution || null);
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

      lastRecordedKey.current = `${activeExercise.id}::${sql.trim()}`;
      recordAttempt({
        exerciseId: activeExercise.id,
        sql,
        status,
        hintsUsed: hintLevel,
        unlockSolution: data.solutionUnlocked,
      });

      if (status === "correct") {
        setCompletedIds((prev) => new Set(prev).add(activeExercise.id));
        celebratedIds.current.add(activeExercise.id);
        setShowCompletion(true);
      }
    } finally {
      setBusy(false);
    }
  }

  async function resetSandbox() {
    setBusy(true);
    try {
      await fetch("/api/sandbox/reset", { method: "POST" });
      setResult(null);
      setLiveResult(null);
      setValidation(undefined);
      setExplainText(t("sandboxReset"));
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
    setHintsUsed(activeExercise.id, nextLevel);
    setShowHintsPanel(true);
  }

  function formatSql() {
    try {
      setSql(format(sql, { language: "tsql" }));
    } catch {
      setExplainText(t("formatFail"));
    }
  }

  function requestSolution() {
    unlockSolution(activeExercise.id);
    setReference({
      sql: activeExercise.referenceSql,
      explanation: localized.referenceExplanation,
    });
    setShowHintsPanel(true);
  }

  function resetEditor() {
    setSql(activeExercise.starterSql);
    setLiveResult(null);
    setLiveError(null);
    if (!isCorrect) setValidation(undefined);
  }

  function selectTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.state === "locked") return;
    setActiveTaskId(taskId);
  }

  const displayResult =
    liveResult && !liveResult.error
      ? liveResult
      : result && !result.error
        ? result
        : null;

  const finishHref = afterChain
    ? `/learn/${afterChain.moduleId}/${afterChain.id}`
    : undefined;

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-3 overflow-x-hidden">
      <div className="flex justify-start">
        <Link
          href={`/learn/${exercise.moduleId}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "pressable gap-1.5 border-[color:var(--border-soft)] bg-[color:var(--surface)]"
          )}
          aria-label={t("backToSection")}
        >
          <List className="size-4" />
          <span className="max-w-[12rem] truncate sm:max-w-[20rem] md:max-w-none">
            {t("backToSectionNamed", { title: moduleTitle })}
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {previous ? (
          <Link
            href={`/learn/${previous.moduleId}/${previous.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "pressable size-10 shrink-0 rounded-full border-[color:var(--border-soft)] bg-[color:var(--surface)] sm:size-11"
            )}
            aria-label={`${t("previousExercise")}: ${previousLocalized?.title}`}
            title={previousLocalized?.title}
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : (
          <span className="size-10 shrink-0 sm:size-11" aria-hidden />
        )}

        <div className="min-w-0 flex-1 text-center">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <Badge variant="secondary" className="capitalize">
              {difficultyLabel}
            </Badge>
            <Badge variant="outline" className="max-w-full truncate">
              {envLabel}
            </Badge>
            {isCorrect ? (
              <Badge className="check-burst bg-[color:var(--success)] text-white hover:bg-[color:var(--success)]">
                {t("completed")}
              </Badge>
            ) : null}
          </div>
          <h2 className="truncate font-[family-name:var(--font-display)] text-lg text-[color:var(--ink)] sm:text-xl md:text-2xl">
            {localized.title}
          </h2>
        </div>

        {afterChain ? (
          <Link
            href={`/learn/${afterChain.moduleId}/${afterChain.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "pressable size-10 shrink-0 rounded-full border-[color:var(--border-soft)] bg-[color:var(--surface)] sm:size-11"
            )}
            aria-label={t("nextExercise")}
          >
            <ChevronRight className="size-5" />
          </Link>
        ) : (
          <span className="size-10 shrink-0 sm:size-11" aria-hidden />
        )}
      </div>

      {/* Reference tables full-width above the query workspace */}
      {isRead && activeExercise.suggestedTables.length > 0 ? (
        <ReferenceTables tables={activeExercise.suggestedTables} />
      ) : null}

      {/* Query + results | tasks — tasks only beside the editor area */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_19rem] lg:gap-4">
        <div className="flex min-w-0 flex-col gap-3">
          <QueryResultsPanel
            live={
              displayResult
                ? {
                    columns: displayResult.columns,
                    rows: displayResult.rows,
                    rowCount: displayResult.rowCount,
                    executionMs: displayResult.executionMs,
                  }
                : null
            }
            liveError={liveError || result?.error?.beginnerHint || null}
            liveBusy={liveBusy}
            matched={validation?.status === "correct"}
          />

          <section className="flex h-[260px] flex-col rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3 sm:h-[280px] sm:p-4">
            <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[color:var(--ink)]">{t("yourSql")}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button variant="ghost" size="sm" className="pressable h-8 px-2 text-xs" onClick={formatSql}>
                  {t("format")}
                </Button>
                <button
                  type="button"
                  onClick={resetEditor}
                  className="inline-flex h-8 items-center gap-1 px-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-text)] hover:text-[color:var(--ink)]"
                >
                  <Eraser className="size-3.5" />
                  Reset
                </button>
                {!isRead ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="pressable h-8 px-2 text-xs"
                    onClick={resetSandbox}
                    disabled={busy}
                  >
                    <RotateCcw className="size-3.5" />
                    {t("resetSandbox")}
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <SqlEditor value={sql} onChange={setSql} schema={schemaMap} height="200px" label="" />
            </div>

            {!isRead ? (
              <div className="mt-2 flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  className="pressable max-sm:min-h-12 max-sm:w-full bg-[color:var(--accent)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--accent)]/90"
                  size="lg"
                  onClick={() => runQuery(false)}
                  disabled={busy}
                >
                  <Play className="size-4" />
                  {busy ? t("running") : t("checkQuery")}
                </Button>
                {pendingConfirm ? (
                  <Button
                    variant="destructive"
                    className="pressable max-sm:w-full"
                    onClick={() => runQuery(true)}
                    disabled={busy}
                  >
                    <AlertTriangle className="size-4" />
                    {t("confirmMutation")}
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  className="pressable max-sm:w-full"
                  onClick={explainQuery}
                  disabled={!sql.trim()}
                >
                  <Sparkles className="size-4" />
                  {t("explainQuery")}
                </Button>
              </div>
            ) : null}
          </section>

          {validation && validation.status !== "correct" ? (
            <Alert className="animate-pop-in border-[color:var(--border-soft)] bg-[color:var(--surface)]">
              <AlertTitle className="text-[color:var(--ink)]">{validation.message}</AlertTitle>
              <AlertDescription>{validation.explanation}</AlertDescription>
            </Alert>
          ) : null}

          {validation?.status === "correct" ? (
            <Alert className="animate-pop-in border-[color:var(--success)]/40 bg-[color:var(--success-soft)]">
              <CheckCircle2 className="check-burst size-4 text-[color:var(--success)]" />
              <AlertTitle className="text-[color:var(--ink)]">{validation.message}</AlertTitle>
              <AlertDescription>{validation.explanation}</AlertDescription>
            </Alert>
          ) : null}

          {explainText ? (
            <Alert className="bg-[color:var(--surface)]">
              <AlertTitle>{t("explanation")}</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{explainText}</AlertDescription>
            </Alert>
          ) : null}

          {result?.warning ? (
            <Alert className="bg-[color:var(--surface)]">
              <AlertTriangle className="size-4" />
              <AlertTitle>{t("impactWarning")}</AlertTitle>
              <AlertDescription>
                {result.warning.message}
                {result.warning.estimatedRows !== undefined
                  ? ` ${t("estimatedRows")}: ${result.warning.estimatedRows}.`
                  : ""}
              </AlertDescription>
            </Alert>
          ) : null}

          {showHintsPanel || hintLevel > 0 || solutionReady ? (
            <section className="space-y-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-[color:var(--ink)]">{t("help")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="pressable"
                  onClick={revealHint}
                  disabled={hintLevel >= 3}
                >
                  <Lightbulb className="size-4" />
                  {t("askHint")} {hintLevel}/3
                </Button>
              </div>
              {hintLevel >= 1 ? (
                <Alert>
                  <AlertTitle>
                    {t("hint")} 1
                  </AlertTitle>
                  <AlertDescription>{localized.hints[0]}</AlertDescription>
                </Alert>
              ) : null}
              {hintLevel >= 2 ? (
                <Alert>
                  <AlertTitle>
                    {t("hint")} 2
                  </AlertTitle>
                  <AlertDescription className="font-mono text-xs">{localized.hints[1]}</AlertDescription>
                </Alert>
              ) : null}
              {hintLevel >= 3 ? (
                <Alert>
                  <AlertTitle>
                    {t("hint")} 3
                  </AlertTitle>
                  <AlertDescription>{localized.hints[2]}</AlertDescription>
                </Alert>
              ) : null}

              {solutionReady ? (
                <div className="animate-fade-up space-y-3 border-t border-[color:var(--border-soft)] pt-3">
                  <p className="font-medium text-[color:var(--ink)]">{t("referenceSolution")}</p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-[color:var(--ink)] p-3 text-xs text-[color:var(--page-bg)]">
                    {(reference?.sql || activeExercise.referenceSql).trim()}
                  </pre>
                  <ul className="space-y-2">
                    {(reference?.explanation || localized.referenceExplanation).map((item) => (
                      <li key={item.clause} className="rounded-xl bg-[color:var(--cream)] p-3">
                        <p className="font-medium text-[color:var(--ink)]">{item.clause}</p>
                        <p className="text-sm text-[color:var(--muted-text)]">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <TasksSidebar
            exerciseOrder={exercise.order}
            tasks={tasks}
            expectedDescription={localized.expectedResult}
            onSelectTask={selectTask}
            showSolutionLink={!solutionReady}
            onShowSolution={requestSolution}
            finishEnabled={allTasksDone && Boolean(finishHref)}
            finishHref={finishHref}
            onAskHint={revealHint}
            hintLevel={hintLevel}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pb-4">
        {previous ? (
          <Link
            href={`/learn/${previous.moduleId}/${previous.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[color:var(--accent)] hover:underline"
          >
            <ArrowLeft className="size-4" />
            {t("previous")}
          </Link>
        ) : (
          <span />
        )}
        {afterChain ? (
          <Link
            href={`/learn/${afterChain.moduleId}/${afterChain.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[color:var(--accent)] hover:underline"
          >
            {t("next")}
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      {showCompletion && isCorrect ? (
        <CompletionBanner
          exerciseTitle={localized.title}
          next={
            allTasksDone
              ? afterChain
              : taskChain.find(
                  (item) =>
                    item.id !== activeExercise.id &&
                    !(completedIds.has(item.id) || getExercise(item.id).status === "correct")
                )
          }
          onDismiss={() => {
            setShowCompletion(false);
            const nextOpen = taskChain.find(
              (item) =>
                item.id !== activeExercise.id &&
                !(completedIds.has(item.id) || getExercise(item.id).status === "correct")
            );
            if (nextOpen) setActiveTaskId(nextOpen.id);
          }}
        />
      ) : null}
    </div>
  );
}

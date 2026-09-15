"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AttemptStatus = "correct" | "partial" | "incorrect" | "error";

export type StoredAttempt = {
  id: string;
  exerciseId: string;
  sql: string;
  at: string;
  status: AttemptStatus;
  hintsUsed: number;
};

export type ExerciseProgress = {
  status: "not_started" | "in_progress" | "correct";
  attempts: number;
  hintsUsed: number;
  solutionUnlocked: boolean;
  lastVisitedAt?: string;
  lastSql?: string;
};

type ProgressState = {
  exercises: Record<string, ExerciseProgress>;
  attempts: StoredAttempt[];
  streak: number;
  lastActiveDate?: string;
};

type ProgressContextValue = {
  state: ProgressState;
  getExercise: (id: string) => ExerciseProgress;
  recordVisit: (exerciseId: string, sql?: string) => void;
  recordAttempt: (input: {
    exerciseId: string;
    sql: string;
    status: AttemptStatus;
    hintsUsed: number;
    unlockSolution?: boolean;
  }) => void;
  unlockSolution: (exerciseId: string) => void;
  setHintsUsed: (exerciseId: string, hintsUsed: number) => void;
  recentExercises: string[];
  completedCount: number;
  inProgressCount: number;
};

const STORAGE_KEY = "sql-coffee-playground-progress-v1";

const emptyExercise = (): ExerciseProgress => ({
  status: "not_started",
  attempts: 0,
  hintsUsed: 0,
  solutionUnlocked: false,
});

const ProgressContext = createContext<ProgressContextValue | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): ProgressState {
  if (typeof window === "undefined") return { exercises: {}, attempts: [], streak: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { exercises: {}, attempts: [], streak: 0 };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { exercises: {}, attempts: [], streak: 0 };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const touchStreak = useCallback((prev: ProgressState): ProgressState => {
    const today = todayKey();
    if (prev.lastActiveDate === today) return prev;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    return {
      ...prev,
      streak: prev.lastActiveDate === yKey ? prev.streak + 1 : 1,
      lastActiveDate: today,
    };
  }, []);

  const getExercise = useCallback(
    (id: string) => state.exercises[id] ?? emptyExercise(),
    [state.exercises]
  );

  const recordVisit = useCallback(
    (exerciseId: string, sql?: string) => {
      setState((prev) => {
        const current = prev.exercises[exerciseId] ?? emptyExercise();
        const next = touchStreak(prev);
        return {
          ...next,
          exercises: {
            ...next.exercises,
            [exerciseId]: {
              ...current,
              status: current.status === "correct" ? "correct" : "in_progress",
              lastVisitedAt: new Date().toISOString(),
              lastSql: sql ?? current.lastSql,
            },
          },
        };
      });
    },
    [touchStreak]
  );

  const recordAttempt = useCallback(
    (input: {
      exerciseId: string;
      sql: string;
      status: AttemptStatus;
      hintsUsed: number;
      unlockSolution?: boolean;
    }) => {
      setState((prev) => {
        const current = prev.exercises[input.exerciseId] ?? emptyExercise();
        const next = touchStreak(prev);
        const attempts = current.attempts + 1;
        const attempt: StoredAttempt = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          exerciseId: input.exerciseId,
          sql: input.sql,
          at: new Date().toISOString(),
          status: input.status,
          hintsUsed: input.hintsUsed,
        };
        return {
          ...next,
          attempts: [attempt, ...next.attempts].slice(0, 200),
          exercises: {
            ...next.exercises,
            [input.exerciseId]: {
              ...current,
              attempts,
              hintsUsed: input.hintsUsed,
              status:
                input.status === "correct"
                  ? "correct"
                  : current.status === "correct"
                    ? "correct"
                    : "in_progress",
              solutionUnlocked:
                current.solutionUnlocked ||
                Boolean(input.unlockSolution) ||
                attempts >= 2,
              lastVisitedAt: new Date().toISOString(),
              lastSql: input.sql,
            },
          },
        };
      });
    },
    [touchStreak]
  );

  const unlockSolution = useCallback((exerciseId: string) => {
    setState((prev) => {
      const current = prev.exercises[exerciseId] ?? emptyExercise();
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseId]: { ...current, solutionUnlocked: true },
        },
      };
    });
  }, []);

  const setHintsUsed = useCallback((exerciseId: string, hintsUsed: number) => {
    setState((prev) => {
      const current = prev.exercises[exerciseId] ?? emptyExercise();
      return {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseId]: {
            ...current,
            hintsUsed,
            status: current.status === "not_started" ? "in_progress" : current.status,
          },
        },
      };
    });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      getExercise,
      recordVisit,
      recordAttempt,
      unlockSolution,
      setHintsUsed,
      recentExercises: Object.entries(state.exercises)
        .filter(([, value]) => value.lastVisitedAt)
        .sort((a, b) => (b[1].lastVisitedAt || "").localeCompare(a[1].lastVisitedAt || ""))
        .map(([id]) => id)
        .slice(0, 5),
      completedCount: Object.values(state.exercises).filter((item) => item.status === "correct").length,
      inProgressCount: Object.values(state.exercises).filter((item) => item.status === "in_progress")
        .length,
    }),
    [state, getExercise, recordVisit, recordAttempt, unlockSolution, setHintsUsed]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress debe usarse dentro de ProgressProvider");
  return ctx;
}

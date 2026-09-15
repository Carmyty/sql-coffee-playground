import { ALL_EXERCISES, getExercise } from "@/data/exercises";
import { getSandboxSchema } from "@/lib/db";
import { executeSql } from "@/lib/sql-executor";
import { columnExists, tableExists } from "@/lib/sandbox";
import { prisma } from "@/lib/db";
import { validateAttempt, type ValidationOutput } from "@/lib/sql-validator";
import type { Exercise } from "@/data/types";

export function listPublicExercises() {
  return ALL_EXERCISES.map((exercise) => ({
    ...exercise,
    referenceSql: undefined,
    referenceExplanation: undefined,
  }));
}

export function publicExercise(exercise: Exercise, unlocked: boolean) {
  if (unlocked) return exercise;
  return {
    ...exercise,
    referenceSql: undefined,
    referenceExplanation: undefined,
  };
}

async function runMutationCheck(exercise: Exercise): Promise<boolean> {
  const check = exercise.mutationCheck;
  if (!check) return true;
  const schema = getSandboxSchema();

  if (check.type === "table_exists" && check.table) {
    return tableExists(schema, check.table);
  }
  if (check.type === "table_missing" && check.table) {
    return !(await tableExists(schema, check.table));
  }
  if (check.type === "column_exists" && check.table && check.column) {
    return columnExists(schema, check.table, check.column);
  }
  if (check.type === "row_exists" && check.sql) {
    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(check.sql);
    return rows.length > 0;
  }
  if (check.type === "row_missing" && check.sql) {
    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(check.sql);
    return rows.length === 0;
  }
  if (check.type === "blocked_without_where") {
    return true;
  }
  return false;
}

export async function validateExerciseAttempt(input: {
  exerciseId: string;
  sql: string;
  confirmMutation?: boolean;
  schema?: string;
  unlockSolution?: boolean;
}) {
  const exercise = getExercise(input.exerciseId);
  if (!exercise) {
    return { ok: false as const, error: "Ejercicio no encontrado" };
  }

  const execution = await executeSql({
    sql: input.sql,
    mode: exercise.environment,
    schema: input.schema,
    confirmMutation: input.confirmMutation,
  });

  if (execution.warning) {
    return { ok: true as const, exerciseId: exercise.id, execution, validation: undefined };
  }

  let expectedRows: Record<string, unknown>[] | undefined;
  if (exercise.validation.compareSql && exercise.environment === "read") {
    const expected = await executeSql({
      sql: exercise.validation.compareSql,
      mode: "read",
      schema: input.schema,
      confirmMutation: true,
      maxRows: 500,
    });
    if (expected.ok) expectedRows = expected.rows;
  }

  const mutationOk =
    exercise.environment === "sandbox"
      ? execution.ok && (await runMutationCheck(exercise))
      : undefined;

  const validation: ValidationOutput = validateAttempt({
    userSql: input.sql,
    userRows: execution.rows,
    userError: execution.error?.message,
    expectedRows,
    rules: exercise.validation,
    mutationOk,
  });

  const nearMissUnlock = validation.nearMiss && validation.status === "partial";

  return {
    ok: true as const,
    exerciseId: exercise.id,
    execution,
    validation,
    solutionUnlocked: Boolean(input.unlockSolution || nearMissUnlock),
    reference: input.unlockSolution || nearMissUnlock
      ? {
          sql: exercise.referenceSql,
          explanation: exercise.referenceExplanation,
        }
      : undefined,
  };
}

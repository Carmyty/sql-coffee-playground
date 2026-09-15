import type { ValidationRule } from "@/lib/sql-validator";

export type Difficulty = "basico" | "intermedio" | "avanzado";
export type ExerciseEnvironment = "read" | "sandbox";

export type LearningModule = {
  id: string;
  order: number;
  title: string;
  description: string;
  prerequisites: string[];
  estimatedMinutes: number;
};

export type MutationCheck = {
  type:
    | "table_exists"
    | "table_missing"
    | "column_exists"
    | "row_exists"
    | "row_missing"
    | "blocked_without_where";
  table?: string;
  column?: string;
  sql?: string;
};

export type Exercise = {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  concepts: string[];
  suggestedTables: string[];
  objective: string;
  expectedResult: string;
  reasoningChecklist: string[];
  hints: [string, string, string];
  referenceSql: string;
  referenceExplanation: Array<{ clause: string; text: string }>;
  starterSql: string;
  environment: ExerciseEnvironment;
  validation: ValidationRule & { compareSql?: string };
  mutationCheck?: MutationCheck;
  unlockAfterAttempts: number;
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  structure: string;
  example: string;
  commonMistakes: string[];
  whenToUse: string;
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

"use client";

import type { ReactNode } from "react";
import type { Exercise } from "@/data/types";
import { AppShell } from "@/components/layout/app-shell";
import { useLanguage } from "@/hooks/use-language";
import { localizeExercise } from "@/lib/i18n/exercises-en";

export function ExercisePageShell({
  exercise,
  children,
}: {
  exercise: Exercise;
  children: ReactNode;
}) {
  const { locale } = useLanguage();
  const localized = localizeExercise(exercise, locale);
  return <AppShell title={localized.title}>{children}</AppShell>;
}

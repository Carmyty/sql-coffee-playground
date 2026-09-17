"use client";

import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/data/types";
import { useLanguage } from "@/hooks/use-language";
import { localizeExercise } from "@/lib/i18n/exercises-en";

type CompletionBannerProps = {
  exerciseTitle: string;
  next?: Exercise;
  onDismiss: () => void;
};

export function CompletionBanner({ exerciseTitle, next, onDismiss }: CompletionBannerProps) {
  const { locale, t } = useLanguage();
  const nextTitle = next ? localizeExercise(next, locale).title : undefined;

  return (
    <div
      className="completion-banner fixed inset-x-0 bottom-20 z-[120] px-3 sm:bottom-6 sm:px-6 lg:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-[color:var(--success)]/30 bg-[color:var(--success-soft)] p-4 shadow-[0_12px_40px_rgba(24,60,40,0.18)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="completion-bounce flex size-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--success)] text-white">
            <PartyPopper className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg text-[color:var(--ink)]">
              {t("exerciseDone")}
            </p>
            <p className="text-sm text-[color:var(--muted-text)]">
              {t("exerciseDoneBody", { title: exerciseTitle })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDismiss} className="bg-[color:var(--surface)]">
            {t("stayHere")}
          </Button>
          {next ? (
            <Link
              href={`/learn/${next.moduleId}/${next.id}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[color:var(--success)] text-white hover:bg-[color:var(--success)]/90"
              )}
              title={nextTitle}
            >
              {t("next")}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

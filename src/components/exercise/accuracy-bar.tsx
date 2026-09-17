"use client";

import { cn } from "@/lib/utils";
import type { LiveAccuracy } from "@/lib/live-accuracy";

export function AccuracyBar({ accuracy }: { accuracy: LiveAccuracy }) {
  const barColor =
    accuracy.tone === "green"
      ? "bg-[color:var(--success)]"
      : accuracy.tone === "amber"
        ? "bg-[color:var(--warning)]"
        : accuracy.tone === "red"
          ? "bg-[color:var(--danger)]"
          : "bg-[color:var(--track)]";

  return (
    <div
      className="space-y-2 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3 shadow-sm"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-[color:var(--ink)]">{accuracy.label}</p>
        <span className="tabular-nums font-semibold text-[color:var(--muted-text)]">{accuracy.score}%</span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-[color:var(--track)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={accuracy.score}
        aria-label="Estado de la consulta"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            accuracy.tone === "green" && "accuracy-pulse",
            barColor
          )}
          style={{ width: `${Math.max(accuracy.score, accuracy.tone === "empty" ? 0 : 4)}%` }}
        />
      </div>
      {accuracy.tips.length > 0 ? (
        <ul className="space-y-1 text-xs text-[color:var(--muted-text)]">
          {accuracy.tips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

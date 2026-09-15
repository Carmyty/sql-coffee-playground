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
          : "bg-[color:var(--cream)]";

  return (
    <div className="space-y-2 rounded-xl border border-[color:var(--cream)] bg-white p-3" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-[color:var(--coffee-dark)]">{accuracy.label}</p>
        <span className="tabular-nums text-[color:var(--muted-text)]">{accuracy.score}%</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[color:var(--cream)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={accuracy.score}
        aria-label="Precisión estimada de la consulta"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300 ease-out", barColor)}
          style={{ width: `${accuracy.score}%` }}
        />
      </div>
      {accuracy.tips.length > 0 ? (
        <ul className="space-y-1 text-xs text-[color:var(--muted-text)]">
          {accuracy.tips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-[11px] text-[color:var(--muted-text)]">
        Guía heurística local (sin IA). No exige una query idéntica: valida ejecutando.
      </p>
    </div>
  );
}

import { findKeywords, normalizeSql } from "@/lib/sql-validator";
import type { Exercise } from "@/data/types";
import type { Locale } from "@/lib/i18n/messages";

export type LiveAccuracy = {
  score: number;
  tone: "empty" | "red" | "amber" | "green";
  label: string;
  tips: string[];
};

type AccuracyExercise = Pick<
  Exercise,
  "validation" | "suggestedTables" | "concepts" | "environment"
>;

function hasKeyword(sql: string, keyword: string) {
  return findKeywords(sql, [keyword]).length > 0;
}

function balancedParens(sql: string) {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < sql.length; i += 1) {
    const ch = sql[i];
    if (!inDouble && ch === "'" && sql[i - 1] !== "\\") inSingle = !inSingle;
    else if (!inSingle && ch === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

function copy(locale: Locale, es: string, en: string) {
  return locale === "en" ? en : es;
}

/**
 * Guía visual sin IA. No exige igualdad con la solución de referencia:
 * puntúa palabras clave pedidas, tablas sugeridas y señales estructurales.
 * Un score alto orienta, pero la validación final sigue siendo por resultado.
 */
export function scoreLiveAccuracy(
  sql: string,
  exercise: AccuracyExercise,
  locale: Locale = "es"
): LiveAccuracy {
  const trimmed = sql.trim();
  const normalizedEmpty = normalizeSql(trimmed);
  if (!trimmed || normalizedEmpty.length < 6) {
    return {
      score: 0,
      tone: "empty",
      label: copy(locale, "Empieza a escribir tu consulta", "Start writing your query"),
      tips: [],
    };
  }

  const normalized = normalizeSql(sql);
  const tips: string[] = [];
  let earned = 0;
  let total = 0;

  for (const keyword of exercise.validation.requiredKeywords ?? []) {
    total += 3;
    if (hasKeyword(sql, keyword)) earned += 3;
    else {
      tips.push(
        copy(
          locale,
          `Todavía no se ve «${keyword.toUpperCase()}», concepto clave de este ejercicio.`,
          `“${keyword.toUpperCase()}” is still missing — a key idea for this exercise.`
        )
      );
    }
  }

  for (const keyword of exercise.validation.forbiddenKeywords ?? []) {
    total += 2;
    if (hasKeyword(sql, keyword)) {
      tips.push(
        copy(
          locale,
          `Este ejercicio pide evitar «${keyword.toUpperCase()}».`,
          `This exercise asks you to avoid “${keyword.toUpperCase()}”.`
        )
      );
    } else earned += 2;
  }

  for (const table of exercise.suggestedTables) {
    total += 2;
    if (normalized.includes(table.toLowerCase())) earned += 2;
    else {
      tips.push(
        copy(
          locale,
          `Revisa si necesitas la tabla «${table}».`,
          `Check whether you need the “${table}” table.`
        )
      );
    }
  }

  const structural: Array<{ ok: boolean; weight: number; tip: string }> = [
    {
      ok: /\bselect\b/i.test(normalized) || exercise.environment === "sandbox",
      weight: 2,
      tip: copy(
        locale,
        "Una consulta de lectura suele empezar con SELECT.",
        "A read query usually starts with SELECT."
      ),
    },
    {
      ok:
        /\bfrom\b/i.test(normalized) ||
        /\bcreate\s+table\b/i.test(normalized) ||
        /\bdrop\s+table\b/i.test(normalized) ||
        /\balter\s+table\b/i.test(normalized),
      weight: 2,
      tip: copy(
        locale,
        "Indica de qué tabla salen los datos (FROM) o qué tabla creas/modificas.",
        "Say which table the data comes from (FROM), or which table you create/change."
      ),
    },
    {
      ok: balancedParens(sql),
      weight: 1,
      tip: copy(locale, "Hay paréntesis sin cerrar.", "There are unclosed parentheses."),
    },
    {
      ok: !/\bdrop\s+schema\b/i.test(normalized) && !/\btruncate\b/i.test(normalized),
      weight: 2,
      tip: copy(
        locale,
        "Esa instrucción peligrosa no está permitida aquí.",
        "That dangerous statement is not allowed here."
      ),
    },
  ];

  if ((exercise.validation.requiredKeywords ?? []).some((item) => /join/i.test(item))) {
    structural.push({
      ok: /\bon\b/i.test(normalized) || /\bcross\s+join\b/i.test(normalized) || /\busing\s*\(/i.test(normalized),
      weight: 2,
      tip: copy(
        locale,
        "Un JOIN casi siempre necesita ON (o USING) para relacionar tablas.",
        "A JOIN almost always needs ON (or USING) to relate tables."
      ),
    });
  }

  if ((exercise.validation.requiredKeywords ?? []).some((item) => /group by/i.test(item))) {
    structural.push({
      ok: /\b(count|sum|avg|min|max)\s*\(/i.test(normalized),
      weight: 1,
      tip: copy(
        locale,
        "GROUP BY suele ir con una agregación como COUNT o SUM.",
        "GROUP BY usually goes with an aggregate like COUNT or SUM."
      ),
    });
  }

  if (
    (exercise.validation.requiredKeywords ?? []).includes("where") ||
    (exercise.environment === "sandbox" && /\b(update|delete)\b/i.test(normalized))
  ) {
    structural.push({
      ok: /\bwhere\b/i.test(normalized) || !/\b(update|delete)\b/i.test(normalized),
      weight: 2,
      tip: copy(
        locale,
        "UPDATE/DELETE necesitan WHERE. En lecturas, WHERE afina el filtro.",
        "UPDATE/DELETE need WHERE. In reads, WHERE refines the filter."
      ),
    });
  }

  for (const item of structural) {
    total += item.weight;
    if (item.ok) earned += item.weight;
    else tips.push(item.tip);
  }

  if (exercise.concepts.length > 0) {
    const hits = exercise.concepts.filter((concept) => {
      const token = concept.replace(/-/g, " ");
      return hasKeyword(sql, token) || normalized.includes(token.replace(/\s+/g, " "));
    }).length;
    total += 2;
    earned += Math.round((hits / exercise.concepts.length) * 2);
  }

  const score = total === 0 ? 0 : Math.max(0, Math.min(100, Math.round((earned / total) * 100)));

  let tone: LiveAccuracy["tone"] = "red";
  let label = copy(locale, "Aún lejos del objetivo", "Still far from the goal");
  if (score >= 80) {
    tone = "green";
    label = copy(locale, "Vas muy bien — ejecuta para comprobar", "Looking great — run it to check");
  } else if (score >= 45) {
    tone = "amber";
    label = copy(locale, "Vas cerca — sigue afinando", "Getting close — keep refining");
  } else if (score > 0) {
    tone = "red";
    label = copy(
      locale,
      "Estás armando la idea — revisa tablas y cláusulas",
      "Building the idea — check tables and clauses"
    );
  }

  return { score, tone, label, tips: tips.slice(0, 3) };
}

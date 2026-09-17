import type { LearningModule } from "@/data/types";
import type { Locale } from "@/lib/i18n/messages";

const EN: Record<string, Pick<LearningModule, "title" | "description">> = {
  fundamentos: {
    title: "Query fundamentals",
    description: "Learn to ask for data: SELECT, columns, aliases, DISTINCT, and FROM.",
  },
  filtros: {
    title: "Filters and operators",
    description: "Keep only the rows that matter with WHERE, LIKE, IN, and nulls.",
  },
  orden: {
    title: "Sorting and limited results",
    description: "Sort rankings and trim the result with ORDER BY and LIMIT.",
  },
  agregaciones: {
    title: "Aggregations",
    description: "Summarize whole tables with COUNT, SUM, AVG, MIN, and MAX.",
  },
  agrupacion: {
    title: "Grouping and aggregate filters",
    description: "GROUP BY splits the summary by category or store; HAVING filters those groups.",
  },
  "joins-basicos": {
    title: "Basic joins",
    description: "Combine related tables: products with categories, orders with customers.",
  },
  "joins-avanzados": {
    title: "Advanced joins and multiple tables",
    description: "LEFT, RIGHT, FULL, anti joins, and multi-table reports.",
  },
  conjuntos: {
    title: "Set operators",
    description: "UNION, UNION ALL, EXCEPT, and INTERSECT to compare lists.",
  },
  escritura: {
    title: "Safe data modification",
    description: "Practice CREATE, INSERT, UPDATE, DELETE, and ALTER only in the sandbox.",
  },
  retos: {
    title: "Capstone challenges",
    description: "Real chain reports: rankings, sales, and inventory.",
  },
};

export function localizeModule(module: LearningModule, locale: Locale): LearningModule {
  if (locale === "es") return module;
  const en = EN[module.id];
  if (!en) return module;
  return { ...module, title: en.title, description: en.description };
}

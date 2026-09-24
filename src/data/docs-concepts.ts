export type DocConcept = {
  id: string;
  order: number;
  icon: "select" | "filter" | "sort" | "join" | "group" | "write" | "top";
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  visualEs: string;
  visualEn: string;
  exampleTsql: string;
  tipEs: string;
  tipEn: string;
};

export const DOC_CONCEPTS: DocConcept[] = [
  {
    id: "select",
    order: 1,
    icon: "select",
    titleEs: "SELECT — pedir columnas",
    titleEn: "SELECT — ask for columns",
    summaryEs: "SELECT elige qué columnas quieres ver. Es solo lectura: no cambia la tabla.",
    summaryEn: "SELECT chooses which columns you want to see. It is read-only: it does not change the table.",
    visualEs: "Tabla completa → proyectas solo las columnas que pediste → resultado más claro",
    visualEn: "Full table → you project only the columns you asked for → clearer result",
    exampleTsql: "SELECT first_name, email\nFROM customers;",
    tipEs: "Evita SELECT * en reportes finales: nombra lo que necesitas.",
    tipEn: "Avoid SELECT * in final reports: name what you need.",
  },
  {
    id: "where",
    order: 2,
    icon: "filter",
    titleEs: "WHERE — filtrar filas",
    titleEn: "WHERE — filter rows",
    summaryEs: "WHERE deja solo las filas que cumplen una condición, antes de agrupar.",
    summaryEn: "WHERE keeps only rows that match a condition, before grouping.",
    visualEs: "Muchas filas → filtro (precio > 50) → pocas filas útiles",
    visualEn: "Many rows → filter (price > 50) → fewer useful rows",
    exampleTsql: "SELECT name, price\nFROM menu_items\nWHERE price > 50;",
    tipEs: "NULL no se compara con =. Usa IS NULL / IS NOT NULL.",
    tipEn: "NULL is not compared with =. Use IS NULL / IS NOT NULL.",
  },
  {
    id: "top",
    order: 3,
    icon: "top",
    titleEs: "TOP — recortar el resultado (T-SQL)",
    titleEn: "TOP — trim the result (T-SQL)",
    summaryEs: "En SQL Server usas TOP n después de SELECT (no LIMIT). Combínalo con ORDER BY para rankings.",
    summaryEn: "In SQL Server you use TOP n after SELECT (not LIMIT). Pair it with ORDER BY for rankings.",
    visualEs: "Filas ordenadas → TOP 10 → solo las diez primeras",
    visualEn: "Sorted rows → TOP 10 → only the first ten",
    exampleTsql: "SELECT TOP 10 order_id, order_date\nFROM orders\nORDER BY order_date DESC;",
    tipEs: "Sin ORDER BY, TOP no es un ranking estable.",
    tipEn: "Without ORDER BY, TOP is not a stable ranking.",
  },
  {
    id: "order",
    order: 4,
    icon: "sort",
    titleEs: "ORDER BY — ordenar",
    titleEn: "ORDER BY — sort",
    summaryEs: "ORDER BY define el orden de las filas. ASC sube; DESC baja.",
    summaryEn: "ORDER BY defines row order. ASC ascends; DESC descends.",
    visualEs: "Filas desordenadas → ORDER BY price DESC → de caro a barato",
    visualEn: "Unordered rows → ORDER BY price DESC → expensive to cheap",
    exampleTsql: "SELECT name, price\nFROM menu_items\nORDER BY price DESC;",
    tipEs: "Puedes ordenar por varias columnas: category_id, price DESC.",
    tipEn: "You can sort by several columns: category_id, price DESC.",
  },
  {
    id: "join",
    order: 5,
    icon: "join",
    titleEs: "JOIN — relacionar tablas",
    titleEn: "JOIN — relate tables",
    summaryEs: "JOIN une tablas por una llave común (ON). INNER solo deja coincidencias; LEFT conserva la izquierda.",
    summaryEn: "JOIN links tables on a shared key (ON). INNER keeps matches only; LEFT keeps the left side.",
    visualEs: "orders ⟷ customers (customer_id) → fila con pedido + email",
    visualEn: "orders ⟷ customers (customer_id) → row with order + email",
    exampleTsql: "SELECT o.order_id, c.email\nFROM orders AS o\nINNER JOIN customers AS c\n  ON o.customer_id = c.customer_id;",
    tipEs: "Casi siempre necesitas ON (o USING). Un JOIN sin condición puede ser un producto cartesiano.",
    tipEn: "You almost always need ON (or USING). A JOIN without a condition can become a cartesian product.",
  },
  {
    id: "group",
    order: 6,
    icon: "group",
    titleEs: "GROUP BY + agregaciones",
    titleEn: "GROUP BY + aggregates",
    summaryEs: "GROUP BY parte las filas en grupos. COUNT, SUM, AVG resumen cada grupo. HAVING filtra grupos.",
    summaryEn: "GROUP BY splits rows into groups. COUNT, SUM, AVG summarize each group. HAVING filters groups.",
    visualEs: "Filas → grupos por categoría → un número por grupo",
    visualEn: "Rows → groups by category → one number per group",
    exampleTsql: "SELECT category_id, COUNT(*) AS total\nFROM menu_items\nGROUP BY category_id\nHAVING COUNT(*) > 3;",
    tipEs: "WHERE filtra filas; HAVING filtra grupos después de agregar.",
    tipEn: "WHERE filters rows; HAVING filters groups after aggregating.",
  },
  {
    id: "like",
    order: 7,
    icon: "filter",
    titleEs: "LIKE — buscar texto",
    titleEn: "LIKE — search text",
    summaryEs: "LIKE compara patrones. % es cualquier texto; _ un carácter. En este curso LIKE se comporta sin importar mayúsculas (estilo SQL Server CI).",
    summaryEn: "LIKE matches patterns. % is any text; _ is one character. Here LIKE is case-insensitive (SQL Server CI style).",
    visualEs: "nombre LIKE '%café%' → filas cuyo nombre contiene café",
    visualEn: "name LIKE '%café%' → rows whose name contains café",
    exampleTsql: "SELECT name, price\nFROM menu_items\nWHERE name LIKE '%café%';",
    tipEs: "Para empezar o terminar exacto: 'café%' o '%café'.",
    tipEn: "For starts-with / ends-with: 'café%' or '%café'.",
  },
  {
    id: "dml",
    order: 8,
    icon: "write",
    titleEs: "INSERT / UPDATE / DELETE (sandbox)",
    titleEn: "INSERT / UPDATE / DELETE (sandbox)",
    summaryEs: "Escribes solo en sql_playground. UPDATE y DELETE exigen WHERE para no borrar todo por accidente.",
    summaryEn: "You write only in sql_playground. UPDATE and DELETE require WHERE so you do not wipe everything by accident.",
    visualEs: "coffee_chain (lectura) 🔒  |  sql_playground (práctica) ✏️",
    visualEn: "coffee_chain (read) 🔒  |  sql_playground (practice) ✏️",
    exampleTsql:
      "UPDATE practice_customers\nSET city = N'Veracruz'\nWHERE email = N'nora.prueba@sandbox.dev';",
    tipEs: "Prefijo N'...' es Unicode en T-SQL (NVARCHAR).",
    tipEn: "The N'...' prefix is Unicode in T-SQL (NVARCHAR).",
  },
];

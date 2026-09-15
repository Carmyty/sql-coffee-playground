import { classifyStatement, stripSqlComments } from "@/lib/sql-guard";

const CLAUSE_HELP: Array<{ key: string; pattern: RegExp; title: string; text: string }> = [
  {
    key: "with",
    pattern: /\bwith\b/i,
    title: "WITH",
    text: "Define una consulta auxiliar (CTE) que puedes reutilizar como si fuera una tabla temporal.",
  },
  {
    key: "select",
    pattern: /\bselect\b/i,
    title: "SELECT",
    text: "Elige qué columnas o cálculos quieres ver. SELECT * trae todas; es útil para explorar, pero en reportes es mejor listar columnas.",
  },
  {
    key: "distinct",
    pattern: /\bdistinct\b/i,
    title: "DISTINCT",
    text: "Elimina filas duplicadas del resultado. Úsalo cuando te importan valores únicos, no cada repetición.",
  },
  {
    key: "from",
    pattern: /\bfrom\b/i,
    title: "FROM",
    text: "Indica la tabla principal de donde salen las filas.",
  },
  {
    key: "join",
    pattern: /\bjoin\b/i,
    title: "JOIN",
    text: "Combina filas de otra tabla. INNER JOIN se queda con coincidencias; LEFT JOIN conserva la tabla izquierda aunque no haya match.",
  },
  {
    key: "where",
    pattern: /\bwhere\b/i,
    title: "WHERE",
    text: "Filtra filas individuales antes de agrupar. Aquí van condiciones como precio > 50 o nombre ILIKE '%latte%'.",
  },
  {
    key: "group",
    pattern: /\bgroup\s+by\b/i,
    title: "GROUP BY",
    text: "Agrupa filas que comparten un valor para poder usar COUNT, SUM o AVG por categoría, sucursal o cliente.",
  },
  {
    key: "having",
    pattern: /\bhaving\b/i,
    title: "HAVING",
    text: "Filtra grupos ya calculados. Si quieres categorías con más de 3 productos, el filtro va en HAVING, no en WHERE.",
  },
  {
    key: "union",
    pattern: /\bunion\b/i,
    title: "UNION / UNION ALL",
    text: "Apila resultados de dos consultas. UNION quita duplicados; UNION ALL conserva todas las filas.",
  },
  {
    key: "except",
    pattern: /\bexcept\b/i,
    title: "EXCEPT",
    text: "Devuelve filas de la primera consulta que no están en la segunda. Sirve para «clientes sin órdenes».",
  },
  {
    key: "intersect",
    pattern: /\bintersect\b/i,
    title: "INTERSECT",
    text: "Devuelve solo las filas que aparecen en ambas consultas.",
  },
  {
    key: "order",
    pattern: /\border\s+by\b/i,
    title: "ORDER BY",
    text: "Ordena el resultado. DESC muestra primero los más grandes o más recientes.",
  },
  {
    key: "limit",
    pattern: /\blimit\b/i,
    title: "LIMIT",
    text: "Corta el resultado a N filas. Ideal para «top 10» junto con ORDER BY.",
  },
  {
    key: "insert",
    pattern: /\binsert\b/i,
    title: "INSERT",
    text: "Agrega filas nuevas. En este playground solo se permite en sql_playground.",
  },
  {
    key: "update",
    pattern: /\bupdate\b/i,
    title: "UPDATE",
    text: "Cambia valores existentes. Siempre lleva WHERE para no modificar toda la tabla.",
  },
  {
    key: "delete",
    pattern: /\bdelete\b/i,
    title: "DELETE",
    text: "Borra filas. También exige WHERE. Si te equivocas, restablece el sandbox.",
  },
  {
    key: "create",
    pattern: /\bcreate\s+table\b/i,
    title: "CREATE TABLE",
    text: "Crea una tabla nueva. Define columnas y tipos, por ejemplo VARCHAR o INTEGER.",
  },
  {
    key: "alter",
    pattern: /\balter\s+table\b/i,
    title: "ALTER TABLE",
    text: "Modifica la estructura: agregar o quitar una columna de práctica.",
  },
  {
    key: "drop",
    pattern: /\bdrop\s+table\b/i,
    title: "DROP TABLE",
    text: "Elimina una tabla completa. Solo tablas de sql_playground; nunca el esquema de la cafetería.",
  },
];

export function explainSql(sql: string): { summary: string; clauses: Array<{ title: string; text: string }> } {
  const kind = classifyStatement(sql);
  const stripped = stripSqlComments(sql).trim();
  if (!stripped) {
    return {
      summary: "No hay consulta para explicar. Escribe un SELECT o una instrucción de práctica.",
      clauses: [],
    };
  }

  const clauses = CLAUSE_HELP.filter((item) => item.pattern.test(stripped)).map((item) => ({
    title: item.title,
    text: item.text,
  }));

  const summaryByKind: Record<string, string> = {
    select: "Esta consulta lee datos. Recorre tablas, puede filtrar, agrupar y devolver un resultado tabular.",
    insert: "Esta instrucción inserta filas nuevas en una tabla de práctica.",
    update: "Esta instrucción actualiza filas existentes. El WHERE decide cuáles cambian.",
    delete: "Esta instrucción borra filas. El WHERE decide cuáles desaparecen.",
    create_table: "Esta instrucción crea una tabla nueva en el sandbox.",
    alter_table: "Esta instrucción cambia la estructura de una tabla de práctica.",
    drop_table: "Esta instrucción elimina una tabla de práctica.",
    unknown: "No reconocí una instrucción de aprendizaje. Usa SELECT o las operaciones de sandbox permitidas.",
  };

  return {
    summary: summaryByKind[kind] ?? summaryByKind.unknown,
    clauses,
  };
}

export function improvementHint(sql: string): string[] {
  const hints: string[] = [];
  const stripped = stripSqlComments(sql);
  if (/\bselect\s+\*/i.test(stripped)) {
    hints.push("SELECT * es cómodo para explorar. Cuando ya sepas el objetivo, lista solo las columnas que necesitas.");
  }
  if (/\bfrom\b/i.test(stripped) && !/\bwhere\b/i.test(stripped) && !/\blimit\b/i.test(stripped) && classifyStatement(sql) === "select") {
    hints.push("Si la tabla es grande, agrega WHERE o LIMIT mientras pruebas para no traer todo.");
  }
  if (/\bjoin\b/i.test(stripped) && !/\bon\b/i.test(stripped) && !/\bcross\s+join\b/i.test(stripped)) {
    hints.push("Un JOIN necesita ON (o USING) para explicar cómo se relacionan las tablas. Sin eso, CROSS JOIN multiplica filas.");
  }
  if (/\bgroup\s+by\b/i.test(stripped) && !/\border\s+by\b/i.test(stripped)) {
    hints.push("Después de agrupar, ORDER BY COUNT(*) DESC suele hacer más legible un ranking.");
  }
  if (/\blike\b/i.test(stripped) && !/\bilike\b/i.test(stripped)) {
    hints.push("LIKE distingue mayúsculas y minúsculas en PostgreSQL. ILIKE es más amable si no te importa el caso.");
  }
  if (hints.length === 0) {
    hints.push("La estructura se entiende. Revisa alias claros, nombres de columnas y si el filtro describe exactamente la pregunta de negocio.");
  }
  return hints.slice(0, 3);
}

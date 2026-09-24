export type SqlStatementKind =
  | "select"
  | "insert"
  | "update"
  | "delete"
  | "create_table"
  | "alter_table"
  | "drop_table"
  | "unknown";

export type SqlGuardIssue = {
  code: string;
  message: string;
  beginnerHint: string;
  severity: "block" | "warn";
};

export type SqlGuardResult = {
  ok: boolean;
  kind: SqlStatementKind;
  sql: string;
  issues: SqlGuardIssue[];
  requiresWhere: boolean;
  isMutation: boolean;
  estimatedImpactSql?: string;
};

const READ_KINDS = new Set<SqlStatementKind>(["select"]);
const MUTATION_KINDS = new Set<SqlStatementKind>([
  "insert",
  "update",
  "delete",
  "create_table",
  "alter_table",
  "drop_table",
]);

const BLOCKED_PATTERNS: Array<{
  code: string;
  regex: RegExp;
  message: string;
  hint: string;
  atStart?: boolean;
}> = [
  {
    code: "drop_schema",
    regex: /\bdrop\s+schema\b/i,
    message: "DROP SCHEMA está bloqueado.",
    hint: "Borrar un esquema eliminaría muchas tablas de golpe. En este playground nunca se permite.",
  },
  {
    code: "drop_database",
    regex: /\bdrop\s+database\b/i,
    message: "DROP DATABASE está bloqueado.",
    hint: "Esa instrucción borraría toda la base. No forma parte del aprendizaje de este curso.",
  },
  {
    code: "truncate",
    regex: /\btruncate\b/i,
    message: "TRUNCATE está bloqueado.",
    hint: "TRUNCATE vacía una tabla completa. Usa DELETE con WHERE en el sandbox si necesitas borrar filas concretas.",
  },
  {
    code: "copy",
    regex: /\bcopy\b/i,
    message: "COPY está bloqueado.",
    hint: "COPY puede leer o escribir archivos del servidor. No es necesario para practicar SQL aquí.",
  },
  {
    code: "grant",
    regex: /\b(grant|revoke)\b/i,
    message: "GRANT y REVOKE están bloqueados.",
    hint: "Esos comandos cambian permisos de la base. El curso se centra en consultar y modificar tablas de práctica.",
  },
  {
    code: "role",
    regex: /\b(create|alter|drop)\s+(user|role)\b/i,
    message: "No se pueden crear ni modificar usuarios o roles.",
    hint: "La seguridad de la base la administra quien despliega la app, no los ejercicios.",
  },
  {
    code: "function",
    regex: /\b(create|alter|drop)\s+(function|procedure|extension|index|view|sequence|trigger|type|materialized\s+view)\b/i,
    message: "Ese tipo de DDL no está permitido.",
    hint: "En escritura segura solo practicamos CREATE TABLE, ALTER TABLE y DROP TABLE.",
  },
  {
    code: "do_block",
    regex: /\bdo\s+(\$\$|\$[a-zA-Z_])/,
    message: "Los bloques DO anónimos están bloqueados.",
    hint: "Ese recurso ejecuta código PL/pgSQL libre. Escribe una sola instrucción SQL.",
  },
  {
    code: "set_reset",
    regex: /^(set|reset)\b/i,
    message: "SET y RESET están bloqueados.",
    hint: "El entorno ya configura search_path y tiempos de espera por ti.",
    atStart: true,
  },
  {
    code: "transaction",
    regex: /^(begin|commit|rollback|start\s+transaction|savepoint)\b/i,
    message: "No se pueden controlar transacciones manualmente.",
    hint: "Cada consulta se ejecuta en su propia transacción segura.",
    atStart: true,
  },
  {
    code: "lock_vacuum",
    regex: /^(lock|vacuum|cluster|reindex|analyze|comment\s+on|security\s+label)\b/i,
    message: "Instrucción de mantenimiento bloqueada.",
    hint: "Esas operaciones son de administración, no de aprendizaje de consultas.",
    atStart: true,
  },
  {
    code: "dangerous_fn",
    regex:
      /\b(pg_read_file|pg_write_file|lo_import|lo_export|dblink|pg_sleep|pg_terminate_backend|pg_reload_conf)\s*\(/i,
    message: "Función peligrosa bloqueada.",
    hint: "Esa función puede afectar el servidor. Usa solo SELECT, filtros, joins y DML de práctica.",
  },
];

export function stripSqlComments(sql: string): string {
  let result = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        result += ch;
      }
      i += 1;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
        result += " ";
        continue;
      }
      i += 1;
      continue;
    }

    if (!inSingle && !inDouble && ch === "-" && next === "-") {
      inLineComment = true;
      i += 2;
      continue;
    }

    if (!inSingle && !inDouble && ch === "/" && next === "*") {
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (!inDouble && ch === "'" && sql[i - 1] !== "\\") {
      inSingle = !inSingle;
    } else if (!inSingle && ch === '"') {
      inDouble = !inDouble;
    }

    result += ch;
    i += 1;
  }

  return result;
}

export function splitSqlStatements(sql: string): string[] {
  const stripped = stripSqlComments(sql);
  const statements: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < stripped.length; i += 1) {
    const ch = stripped[i];
    if (!inDouble && ch === "'" && stripped[i - 1] !== "\\") {
      inSingle = !inSingle;
    } else if (!inSingle && ch === '"') {
      inDouble = !inDouble;
    }

    if (ch === ";" && !inSingle && !inDouble) {
      if (current.trim()) statements.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

export function classifyStatement(sql: string): SqlStatementKind {
  const normalized = stripSqlComments(sql).trim().replace(/\s+/g, " ");
  const head = normalized.replace(/^\(+/, "").trim();

  if (/^with\b/i.test(head)) {
    if (/\binsert\s+into\b/i.test(head)) return "insert";
    if (/\bupdate\s+(?:"[^"]+"|[\w.]+)\s+set\b/i.test(head)) return "update";
    if (/\bdelete\s+from\b/i.test(head)) return "delete";
    return "select";
  }
  if (/^explain\s+(?:\([^)]*\)\s*)?analyze\b[\s\S]*\binsert\s+into\b/i.test(head)) return "insert";
  if (/^explain\s+(?:\([^)]*\)\s*)?analyze\b[\s\S]*\bupdate\s+(?:"[^"]+"|[\w.]+)\s+set\b/i.test(head)) return "update";
  if (/^explain\s+(?:\([^)]*\)\s*)?analyze\b[\s\S]*\bdelete\s+from\b/i.test(head)) return "delete";
  if (/^(select|values|table|explain|show)\b/i.test(head)) return "select";
  if (/^insert\b/i.test(head)) return "insert";
  if (/^update\b/i.test(head)) return "update";
  if (/^delete\b/i.test(head)) return "delete";
  if (/^create\s+table\b/i.test(head)) return "create_table";
  if (/^alter\s+table\b/i.test(head)) return "alter_table";
  if (/^drop\s+table\b/i.test(head)) return "drop_table";
  return "unknown";
}

export function hasWhereClause(sql: string): boolean {
  const stripped = stripSqlComments(sql);
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < stripped.length) {
    const ch = stripped[i];
    if (!inDouble && ch === "'" && stripped[i - 1] !== "\\") inSingle = !inSingle;
    else if (!inSingle && ch === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === "(") depth += 1;
    else if (!inSingle && !inDouble && ch === ")") depth = Math.max(0, depth - 1);
    else if (!inSingle && !inDouble && depth === 0) {
      const slice = stripped.slice(i);
      if (/^where\b/i.test(slice)) return true;
    }
    i += 1;
  }
  return false;
}

export function extractQualifiedIdentifiers(sql: string): string[] {
  const stripped = stripSqlComments(sql);
  const matches =
    stripped.match(/(?:"(?:[^"]|"")*"|[a-zA-Z_]\w*)\s*\.\s*(?:"(?:[^"]|"")*"|[a-zA-Z_]\w*)/g) ||
    [];
  return matches.map((item) =>
    item
      .split(".")
      .map((part) => part.trim().replace(/^"|"$/g, "").replaceAll('""', '"').toLowerCase())
      .join(".")
  );
}

function schemaFromQualified(identifier: string): string {
  return identifier.split(".")[0];
}

export function buildCountSql(sql: string, kind: SqlStatementKind): string | undefined {
  const stripped = stripSqlComments(sql).replace(/;+\s*$/, "");
  if (kind === "delete") {
    const match = stripped.match(/^delete\s+from\s+([\s\S]+)$/i);
    if (!match) return undefined;
    return `SELECT COUNT(*)::int AS estimated_rows FROM ${match[1]}`;
  }
  if (kind === "update") {
    const match = stripped.match(/^update\s+([\w."]+)\s+set\s+[\s\S]*?(?:\swhere\s+([\s\S]+))$/i);
    if (!match) return undefined;
    const table = match[1];
    const where = match[2];
    return `SELECT COUNT(*)::int AS estimated_rows FROM ${table} WHERE ${where}`;
  }
  return undefined;
}

export function inspectSql(
  rawSql: string,
  options: {
    mode: "read" | "sandbox";
    readSchema: string;
    sandboxSchema: string;
  }
): SqlGuardResult {
  const issues: SqlGuardIssue[] = [];
  const statements = splitSqlStatements(rawSql);

  if (!rawSql.trim()) {
    issues.push({
      code: "empty",
      message: "La consulta está vacía.",
      beginnerHint: "Escribe una instrucción T-SQL, por ejemplo SELECT TOP 10 * FROM customers;",
      severity: "block",
    });
    return {
      ok: false,
      kind: "unknown",
      sql: "",
      issues,
      requiresWhere: false,
      isMutation: false,
    };
  }

  if (statements.length !== 1) {
    issues.push({
      code: "multiple_statements",
      message: "Solo se permite una instrucción a la vez.",
      beginnerHint: "Quita el segundo punto y coma. Practica una consulta por intento para entender mejor el resultado.",
      severity: "block",
    });
  }

  const sql = statements[0] ?? rawSql.trim();
  const kind = classifyStatement(sql);

  const strippedSql = stripSqlComments(sql).trim();
  for (const rule of BLOCKED_PATTERNS) {
    const target = rule.atStart ? strippedSql : strippedSql;
    if (rule.regex.test(target)) {
      issues.push({
        code: rule.code,
        message: rule.message,
        beginnerHint: rule.hint,
        severity: "block",
      });
    }
  }

  if (kind === "unknown") {
    issues.push({
      code: "unsupported",
      message: "Este tipo de instrucción no está permitido en el playground.",
      beginnerHint:
        options.mode === "read"
          ? "En el esquema real solo puedes leer datos con SELECT."
          : "En práctica segura puedes usar SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE y DROP TABLE.",
      severity: "block",
    });
  }

  const isMutation = MUTATION_KINDS.has(kind);
  const requiresWhere = kind === "update" || kind === "delete";

  if (requiresWhere && !hasWhereClause(sql)) {
    issues.push({
      code: "missing_where",
      message: `${kind.toUpperCase()} sin WHERE está bloqueado.`,
      beginnerHint:
        "Sin WHERE esa instrucción afectaría todas las filas. Agrega una condición, por ejemplo WHERE email = 'nora.prueba@sandbox.dev'.",
      severity: "block",
    });
  }

  const qualified = extractQualifiedIdentifiers(sql);
  const forbiddenWriteSchemas = new Set([
    options.readSchema.toLowerCase(),
    "public",
    "pg_catalog",
    "information_schema",
  ]);

  if (options.mode === "read") {
    if (isMutation) {
      issues.push({
        code: "write_on_read",
        message: "Las consultas de escritura no se ejecutan contra la base real.",
        beginnerHint: `Cambia a práctica segura (${options.sandboxSchema}) para INSERT, UPDATE, DELETE o DDL.`,
        severity: "block",
      });
    }
  } else if (isMutation) {
    for (const identifier of qualified) {
      const schema = schemaFromQualified(identifier);
      if (forbiddenWriteSchemas.has(schema) && schema !== options.sandboxSchema.toLowerCase()) {
        issues.push({
          code: "write_protected_schema",
          message: `No se puede modificar el esquema ${schema}.`,
          beginnerHint: `Las escrituras solo ocurren en ${options.sandboxSchema}. Deja el esquema real intacto.`,
          severity: "block",
        });
      }
    }

    if (kind === "drop_table" && new RegExp(`\\b${options.readSchema}\\s*\\.`, "i").test(sql)) {
      issues.push({
        code: "drop_protected",
        message: "No puedes borrar tablas del esquema de la cafetería.",
        beginnerHint: "Usa DROP TABLE solo con tablas creadas en sql_playground.",
        severity: "block",
      });
    }
  }

  if (options.mode === "read" && READ_KINDS.has(kind)) {
    for (const identifier of qualified) {
      const schema = schemaFromQualified(identifier);
      if (schema === options.sandboxSchema.toLowerCase()) {
        continue;
      }
    }
  }

  const blocking = issues.filter((issue) => issue.severity === "block");
  return {
    ok: blocking.length === 0,
    kind,
    sql,
    issues,
    requiresWhere,
    isMutation,
    estimatedImpactSql:
      requiresWhere && hasWhereClause(sql) ? buildCountSql(sql, kind) : undefined,
  };
}

export function isReadOnlyKind(kind: SqlStatementKind) {
  return READ_KINDS.has(kind);
}

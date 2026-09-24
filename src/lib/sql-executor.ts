import { inspectSql, type SqlGuardResult, type SqlStatementKind } from "@/lib/sql-guard";
import {
  getDefaultSchema,
  getMaxRows,
  getSandboxSchema,
  getStatementTimeoutMs,
  prisma,
} from "@/lib/db";
import { translateTsqlToPostgres } from "@/lib/tsql/translate";

export type QueryEnvironment = "read" | "sandbox";

export type QueryColumn = {
  name: string;
  dataType?: string;
};

export type ExecuteSqlRequest = {
  sql: string;
  mode?: "read" | "sandbox" | "auto";
  schema?: string;
  confirmMutation?: boolean;
  maxRows?: number;
};

export type ExecuteSqlResult = {
  ok: boolean;
  environment: QueryEnvironment;
  schema: string;
  kind: SqlStatementKind;
  rows: Record<string, unknown>[];
  columns: QueryColumn[];
  rowCount: number;
  truncated: boolean;
  executionMs: number;
  commandTag?: string;
  dialect?: "tsql";
  translatedSql?: string;
  warning?: {
    message: string;
    estimatedRows?: number;
    requiresConfirm: boolean;
  };
  error?: {
    message: string;
    beginnerHint: string;
    code?: string;
  };
  guard: SqlGuardResult;
};

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    const maybeDecimal = value as { toNumber?: () => number; toString?: () => string };
    if (typeof maybeDecimal.toNumber === "function") {
      try {
        return maybeDecimal.toNumber();
      } catch {
        return maybeDecimal.toString?.() ?? String(value);
      }
    }
    if (Buffer.isBuffer(value)) return value.toString("base64");
  }
  return value;
}

function rowsFromUnknown(result: unknown): Record<string, unknown>[] {
  if (!Array.isArray(result)) return [];
  return result.map((row) => {
    if (!row || typeof row !== "object") return { value: serializeValue(row) };
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
      output[key] = serializeValue(value);
    }
    return output;
  });
}

export function beginnerErrorHint(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("does not exist") && lower.includes("relation")) {
    return "No se encontró esa tabla. En T-SQL usa el nombre exacto (p. ej. customers). Revisa el explorador de esquema.";
  }
  if (lower.includes("does not exist") && lower.includes("column")) {
    return "Esa columna no existe. Copia el nombre exacto del esquema (incluye guiones bajos).";
  }
  if (lower.includes("syntax error")) {
    return "Error de sintaxis T-SQL. Recuerda: TOP va después de SELECT; ORDER BY antes de OFFSET/FETCH; no uses LIMIT (eso es PostgreSQL/MySQL).";
  }
  if (lower.includes("must appear in the group by") || lower.includes("not in aggregate")) {
    return "Con GROUP BY, cada columna del SELECT debe estar agrupada o dentro de COUNT(), SUM(), AVG(), etc.";
  }
  if (lower.includes("aggregate") && lower.includes("where")) {
    return "WHERE no filtra agregados. Usa HAVING después de GROUP BY.";
  }
  if (lower.includes("permission denied") || lower.includes("read-only")) {
    return "Esa operación no está permitida aquí. Las escrituras van al sandbox sql_playground.";
  }
  if (lower.includes("unique") || lower.includes("duplicate")) {
    return "Valor duplicado en una columna única (p. ej. email). Elige otro valor.";
  }
  if (lower.includes("foreign key") || lower.includes("violates foreign")) {
    return "La fila apunta a un id que no existe en la tabla relacionada.";
  }
  if (lower.includes("timeout") || lower.includes("canceling statement")) {
    return "La consulta tardó demasiado. Agrega un filtro o TOP mientras pruebas.";
  }
  return "Revisa el mensaje técnico y compáralo con el esquema. Si estás atascado, pide una pista.";
}

export function quoteIdent(identifier: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error("Nombre de esquema inválido.");
  }
  return `"${identifier}"`;
}

function resolveMode(
  requested: ExecuteSqlRequest["mode"],
  kind: SqlStatementKind,
  isMutation: boolean
): QueryEnvironment {
  if (requested === "read" || requested === "sandbox") return requested;
  return isMutation || kind !== "select" ? "sandbox" : "read";
}

async function estimateImpact(sql: string | undefined): Promise<number | undefined> {
  if (!sql) return undefined;
  try {
    const rows = (await prisma.$queryRawUnsafe(sql)) as Array<{ estimated_rows?: number }>;
    const value = rows[0]?.estimated_rows;
    return typeof value === "number" ? value : Number(value);
  } catch {
    return undefined;
  }
}

export async function executeSql(request: ExecuteSqlRequest): Promise<ExecuteSqlResult> {
  const readSchema = request.schema || getDefaultSchema();
  const sandboxSchema = getSandboxSchema();
  const timeoutMs = getStatementTimeoutMs();
  const maxRows = Math.min(request.maxRows ?? getMaxRows(), getMaxRows());

  const translated = translateTsqlToPostgres(request.sql);
  const executableSql = translated.sql;

  const previewGuard = inspectSql(executableSql, {
    mode: "sandbox",
    readSchema,
    sandboxSchema,
  });
  const mode = resolveMode(request.mode, previewGuard.kind, previewGuard.isMutation);
  const guard = inspectSql(executableSql, { mode, readSchema, sandboxSchema });
  const schema = mode === "sandbox" ? sandboxSchema : readSchema;

  const base: ExecuteSqlResult = {
    ok: false,
    environment: mode,
    schema,
    kind: guard.kind,
    rows: [],
    columns: [],
    rowCount: 0,
    truncated: false,
    executionMs: 0,
    dialect: "tsql",
    translatedSql: executableSql,
    guard,
  };

  if (!guard.ok) {
    const issue = guard.issues[0];
    return {
      ...base,
      error: {
        message: issue?.message || "Consulta bloqueada",
        beginnerHint: issue?.beginnerHint || "",
        code: issue?.code,
      },
    };
  }

  if (guard.isMutation && !request.confirmMutation) {
    const estimatedRows = await estimateImpact(
      guard.estimatedImpactSql?.replace(
        /FROM\s+((?:"?[\w]+"?\.)?"?[\w]+"?)/i,
        (full, table: string) => {
          if (table.includes(".")) return full;
          return `FROM ${sandboxSchema}.${table}`;
        }
      )
    );
    const impact =
      guard.kind === "update" || guard.kind === "delete"
        ? `Esta instrucción puede afectar ${estimatedRows ?? "varias"} fila(s).`
        : "Esta instrucción modifica la sandbox de práctica, no la base real de la cafetería.";
    return {
      ...base,
      warning: {
        message: `${impact} Confirma si deseas ejecutarla. Luego puedes restablecer el sandbox.`,
        estimatedRows,
        requiresConfirm: true,
      },
    };
  }

  const started = Date.now();
  try {
    return await prisma.$transaction(
      async (tx) => {
        if (mode === "read") {
          await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
        }
        await tx.$executeRawUnsafe(`SET LOCAL statement_timeout = ${timeoutMs}`);
        await tx.$executeRawUnsafe(`SET LOCAL search_path TO ${quoteIdent(schema)}, public`);

        if (guard.kind !== "select") {
          const affected = await tx.$executeRawUnsafe(guard.sql);
          return {
            ...base,
            ok: true,
            rows: [],
            columns: [],
            rowCount: typeof affected === "number" ? affected : 0,
            truncated: false,
            executionMs: Date.now() - started,
            commandTag: guard.kind.toUpperCase(),
          };
        }

        let sqlToRun = guard.sql;
        if (!/\blimit\b/i.test(guard.sql)) {
          sqlToRun = `${guard.sql.replace(/;+\s*$/, "")} LIMIT ${maxRows + 1}`;
        }

        const raw = await tx.$queryRawUnsafe(sqlToRun);
        const rows = rowsFromUnknown(raw);
        const truncated = rows.length > maxRows;
        const limited = truncated ? rows.slice(0, maxRows) : rows;
        const columns = limited[0] ? Object.keys(limited[0]).map((name) => ({ name })) : [];

        return {
          ...base,
          ok: true,
          rows: limited,
          columns,
          rowCount: limited.length,
          truncated,
          executionMs: Date.now() - started,
          commandTag: guard.kind.toUpperCase(),
        };
      },
      { maxWait: timeoutMs, timeout: timeoutMs + 2_000 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al ejecutar SQL";
    return {
      ...base,
      executionMs: Date.now() - started,
      error: {
        message,
        beginnerHint: beginnerErrorHint(message),
      },
    };
  }
}

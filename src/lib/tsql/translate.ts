/**
 * Traduce un subconjunto de T-SQL (SQL Server) a PostgreSQL para ejecutar
 * en este playground. Los estudiantes escriben T-SQL; el runtime traduce.
 */

export type TranslateResult = {
  sql: string;
  notes: string[];
};

function stripGoBatches(sql: string) {
  return sql
    .split(/\n\s*GO\s*\n/gi)
    .map((part) => part.trim())
    .filter(Boolean)[0] || sql;
}

function convertBrackets(sql: string) {
  // [identifier] → "identifier" for Postgres
  return sql.replace(/\[([^\]]+)\]/g, (_, id: string) => `"${id.replace(/"/g, '""')}"`);
}

function convertTop(sql: string) {
  // SELECT TOP 10 ... → SELECT ... LIMIT 10
  // SELECT DISTINCT TOP 5 ... → SELECT DISTINCT ... LIMIT 5
  const topMatch = sql.match(/\bselect\s+(distinct\s+)?top\s+(\d+)\s+/i);
  if (!topMatch) return sql;
  const distinct = topMatch[1] || "";
  const n = topMatch[2];
  let next = sql.replace(/\bselect\s+(distinct\s+)?top\s+\d+\s+/i, `SELECT ${distinct}`);
  if (!/\blimit\s+\d+/i.test(next)) {
    next = `${next.trim().replace(/;?\s*$/, "")} LIMIT ${n}`;
  }
  return next;
}

function convertOffsetFetch(sql: string) {
  // OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY → LIMIT 5 OFFSET 0
  return sql.replace(
    /\boffset\s+(\d+)\s+rows\s+fetch\s+(?:next|first)\s+(\d+)\s+rows\s+only\b/gi,
    (_, offset: string, limit: string) => `LIMIT ${limit} OFFSET ${offset}`
  );
}

export function translateTsqlToPostgres(inputSql: string): TranslateResult {
  const notes: string[] = [];
  let sql = stripGoBatches(inputSql.trim());
  sql = convertBrackets(sql);

  if (/\btop\s+\d+/i.test(sql)) {
    notes.push("TOP → LIMIT");
    sql = convertTop(sql);
  }

  if (/\boffset\s+\d+\s+rows\b/i.test(sql)) {
    notes.push("OFFSET/FETCH → LIMIT/OFFSET");
    sql = convertOffsetFetch(sql);
  }

  const replacements: Array<[RegExp, string, string?]> = [
    [/\bgetdate\s*\(\s*\)/gi, "NOW()", "GETDATE() → NOW()"],
    [/\bsysdatetime\s*\(\s*\)/gi, "NOW()", "SYSDATETIME() → NOW()"],
    [/\bgetutcdate\s*\(\s*\)/gi, "NOW() AT TIME ZONE 'UTC'", "GETUTCDATE()"],
    [/\bisnull\s*\(/gi, "COALESCE(", "ISNULL → COALESCE"],
    [/\blen\s*\(/gi, "LENGTH(", "LEN → LENGTH"],
    [/\bnchar\s*\(/gi, "CHR(", "NCHAR → CHR"],
    [/\bnewid\s*\(\s*\)/gi, "gen_random_uuid()", "NEWID()"],
    [/\bnvarchar\s*\(\s*max\s*\)/gi, "TEXT", "NVARCHAR(MAX) → TEXT"],
    [/\bnvarchar\s*\(/gi, "VARCHAR(", "NVARCHAR → VARCHAR"],
    [/\bdatetime2\b/gi, "TIMESTAMP", "DATETIME2 → TIMESTAMP"],
    [/\bdatetime\b/gi, "TIMESTAMP", "DATETIME → TIMESTAMP"],
    [/\bbit\b/gi, "BOOLEAN", "BIT → BOOLEAN"],
    [/\bint\s+identity\s*\(\s*1\s*,\s*1\s*\)/gi, "SERIAL", "INT IDENTITY → SERIAL"],
    [/\binteger\s+identity\s*\(\s*1\s*,\s*1\s*\)/gi, "SERIAL", "INTEGER IDENTITY → SERIAL"],
    [/\bdbo\./gi, "", "dbo. prefix removed"],
    [/\bcoffee_chain\.dbo\./gi, "coffee_chain.", undefined],
    [/\bsql_playground\.dbo\./gi, "sql_playground.", undefined],
  ];

  for (const [pattern, replacement, note] of replacements) {
    if (pattern.test(sql)) {
      sql = sql.replace(pattern, replacement);
      if (note) notes.push(note);
    }
  }

  // T-SQL string concat with + between quoted strings → ||
  // Conservative: only 'lit' + 'lit' or col + 'lit' patterns common in exercises
  if (/'[^']*'\s*\+\s*'/.test(sql) || /\w\s*\+\s*'/.test(sql)) {
    // Avoid changing arithmetic: digit + digit stays
    sql = sql.replace(/('(?:[^']|'')*'|\b[a-z_][\w.]*)\s*\+\s*('(?:[^']|'')*'|\b[a-z_][\w.]*)/gi, (match, a, b) => {
      if (/^\d/.test(a) || /^\d/.test(b)) return match;
      notes.push("+ (texto) → ||");
      return `${a} || ${b}`;
    });
  }

  // LIKE in T-SQL is usually case-insensitive → ILIKE for student expectations
  sql = sql.replace(/\blike\b/gi, (m) => {
    notes.push("LIKE → ILIKE (insensible a mayúsculas, estilo SQL Server CI)");
    return "ILIKE";
  });

  // Boolean literals: = TRUE already ok; = 1 for bit columns often used
  // Keep 1/0 as-is; PG compares boolean to true with is_available = true or = 't'

  return { sql: sql.trim(), notes: Array.from(new Set(notes)) };
}

export function isLikelySelect(sql: string) {
  return /^\s*(with\b|select\b)/i.test(sql.trim());
}

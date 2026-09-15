export type QueryRow = Record<string, unknown>;

export type ValidationStatus = "correct" | "partial" | "incorrect" | "error";

export type ValidationRule = {
  requiredKeywords?: string[];
  forbiddenKeywords?: string[];
  requiredColumns?: string[];
  forbiddenColumns?: string[];
  matchMode?: "set" | "ordered" | "exists" | "mutation";
  ignoreRowOrder?: boolean;
  allowExtraColumns?: boolean;
  minRows?: number;
  maxRows?: number;
  expectedRowCount?: number;
  numericTolerance?: number;
};

export type ValidationInput = {
  userSql: string;
  userRows: QueryRow[];
  userError?: string;
  expectedRows?: QueryRow[];
  rules: ValidationRule;
  mutationOk?: boolean;
};

export type ValidationOutput = {
  status: ValidationStatus;
  message: string;
  explanation: string;
  nearMiss: boolean;
  missingKeywords: string[];
  missingColumns: string[];
};

function normalizeKey(key: string) {
  return key.replace(/["']/g, "").trim().toLowerCase();
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "nan";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) return value.toISOString();
  const asNumber = Number(value);
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(asNumber) && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return String(asNumber);
  }
  return String(value).trim().toLowerCase();
}

export function normalizeSql(sql: string) {
  return sql.replace(/--.*$/gm, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

export function findKeywords(sql: string, keywords: string[]) {
  const normalized = ` ${normalizeSql(sql)} `;
  return keywords.filter((keyword) => {
    const pattern = keyword.trim().toLowerCase();
    if (pattern.includes(" ")) return normalized.includes(` ${pattern} `) || normalized.includes(pattern);
    return new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(normalized);
  });
}

function rowSignature(row: QueryRow, columns?: string[]) {
  const keys = (columns ?? Object.keys(row).map(normalizeKey)).slice().sort();
  const normalizedRow: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    normalizedRow[normalizeKey(key)] = normalizeValue(value);
  }
  return keys.map((key) => `${key}=${normalizedRow[key] ?? ""}`).join("|");
}

function presentColumns(rows: QueryRow[]) {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]).map(normalizeKey);
}

function columnsMatch(required: string[], actual: string[]) {
  const actualSet = new Set(actual);
  return required.filter((column) => {
    const wanted = normalizeKey(column);
    return ![...actualSet].some((item) => item === wanted || item.endsWith(`_${wanted}`) || item.includes(wanted));
  });
}

function valueSignature(row: QueryRow) {
  return Object.values(row).map(normalizeValue).sort().join("|");
}

function compareLists(expected: string[], user: string[], ignoreOrder: boolean) {
  if (!ignoreOrder) {
    const equal = expected.length === user.length && expected.every((item, index) => item === user[index]);
    return {
      equal,
      extra: Math.max(0, user.length - expected.length),
      missing: Math.max(0, expected.length - user.length),
    };
  }
  const count = (items: string[]) => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item, (map.get(item) || 0) + 1);
    return map;
  };
  const expectedMap = count(expected);
  const userMap = count(user);
  let missing = 0;
  let extra = 0;
  const keys = new Set([...expectedMap.keys(), ...userMap.keys()]);
  for (const key of keys) {
    const left = expectedMap.get(key) || 0;
    const right = userMap.get(key) || 0;
    if (right < left) missing += left - right;
    if (right > left) extra += right - left;
  }
  return { equal: missing === 0 && extra === 0, extra, missing };
}

function compareBags(
  userRows: QueryRow[],
  expectedRows: QueryRow[],
  ignoreOrder: boolean,
  requiredColumns?: string[]
) {
  if (expectedRows.length === 0) {
    return { equal: userRows.length === 0, extra: userRows.length, missing: 0 };
  }
  const named = compareLists(
    expectedRows.map((row) => rowSignature(row, requiredColumns?.map(normalizeKey))),
    userRows.map((row) => rowSignature(row, requiredColumns?.map(normalizeKey))),
    ignoreOrder
  );
  if (named.equal) return named;
  return compareLists(expectedRows.map(valueSignature), userRows.map(valueSignature), ignoreOrder);
}

export function validateAttempt(input: ValidationInput): ValidationOutput {
  const rules = input.rules;
  const sql = input.userSql || "";
  const requiredKeywords = rules.requiredKeywords ?? [];
  const foundKeywords = findKeywords(sql, requiredKeywords);
  const missingKeywords = requiredKeywords.filter(
    (keyword) => !foundKeywords.map((item) => item.toLowerCase()).includes(keyword.toLowerCase())
  );
  const forbiddenHit = findKeywords(sql, rules.forbiddenKeywords ?? []);
  const actualColumns = presentColumns(input.userRows);
  const missingColumns = columnsMatch(rules.requiredColumns ?? [], actualColumns);

  if (input.userError) {
    return {
      status: "error",
      message: "La consulta no se pudo ejecutar.",
      explanation: "Corrige el error técnico y vuelve a intentarlo. El motor ya te dio una pista para principiantes.",
      nearMiss: false,
      missingKeywords,
      missingColumns,
    };
  }

  if (forbiddenHit.length > 0) {
    return {
      status: "incorrect",
      message: "Tu consulta funciona, pero usa algo que este ejercicio pide evitar.",
      explanation: `Encontré ${forbiddenHit.join(", ")}. Revisa el objetivo: a veces se pide un JOIN concreto o un operador de conjuntos específico.`,
      nearMiss: missingKeywords.length === 0,
      missingKeywords,
      missingColumns,
    };
  }

  if (rules.matchMode === "mutation") {
    if (input.mutationOk && missingKeywords.length === 0) {
      return {
        status: "correct",
        message: "¡Correcto!",
        explanation: "La instrucción de práctica se ejecutó y cumple el objetivo del ejercicio.",
        nearMiss: false,
        missingKeywords,
        missingColumns,
      };
    }
    if (input.mutationOk) {
      return {
        status: "partial",
        message: "Tu consulta funciona, pero falta un concepto clave.",
        explanation: `Ejecutaste un cambio, pero todavía no aparece: ${missingKeywords.join(", ") || "la operación pedida"}.`,
        nearMiss: true,
        missingKeywords,
        missingColumns,
      };
    }
    return {
      status: "incorrect",
      message: "Aún no se cumple el cambio esperado en la sandbox.",
      explanation: "Revisa el nombre de la tabla de práctica, las columnas y el WHERE. Recuerda confirmar la advertencia antes de modificar datos.",
      nearMiss: missingKeywords.length === 0,
      missingKeywords,
      missingColumns,
    };
  }

  if (missingKeywords.length > 0 && (rules.requiredKeywords?.length || 0) > 0) {
    const resultComparison =
      input.expectedRows && input.expectedRows.length > 0
        ? compareBags(
            input.userRows,
            input.expectedRows,
            rules.ignoreRowOrder ?? rules.matchMode !== "ordered",
            rules.requiredColumns
          )
        : null;
    if (resultComparison?.equal) {
      return {
        status: "partial",
        message: "El resultado se ve bien, pero el ejercicio pide practicar otra cláusula.",
        explanation: `Obtuviste filas correctas, aunque falta usar ${missingKeywords.join(", ")}. Llegar al número no basta: queremos que practiques el concepto.`,
        nearMiss: true,
        missingKeywords,
        missingColumns,
      };
    }
  }

  if (rules.minRows !== undefined && input.userRows.length < rules.minRows) {
    if (missingKeywords.length > 0) {
      return {
        status: "incorrect",
        message: "Todavía falta el concepto principal de este ejercicio.",
        explanation: `Incluye ${missingKeywords.join(", ")} de forma consciente. Además, el resultado tiene pocas filas para lo que pide el objetivo.`,
        nearMiss: false,
        missingKeywords,
        missingColumns,
      };
    }
    return {
      status: "partial",
      message: "Vas cerca: tu consulta devuelve pocas filas.",
      explanation: "Revisa el filtro WHERE, un JOIN demasiado restrictivo o un HAVING que deja fuera grupos válidos.",
      nearMiss: true,
      missingKeywords,
      missingColumns,
    };
  }

  if (rules.maxRows !== undefined && input.userRows.length > rules.maxRows) {
    return {
      status: "partial",
      message: "Tu consulta funciona, pero faltan límites o filtros.",
      explanation: "Hay más filas de las esperadas. Prueba WHERE, HAVING o LIMIT según el objetivo.",
      nearMiss: true,
      missingKeywords,
      missingColumns,
    };
  }

  if (missingColumns.length > 0 && input.userRows.length > 0) {
    return {
      status: "partial",
      message: "Tu consulta funciona, pero faltan columnas esenciales.",
      explanation: `No encuentro ${missingColumns.join(", ")} en el resultado. Puedes usar alias, pero el dato debe estar.`,
      nearMiss: true,
      missingKeywords,
      missingColumns,
    };
  }

  if (rules.matchMode === "exists") {
    if (input.userRows.length > 0 && missingKeywords.length === 0) {
      return {
        status: "correct",
        message: "¡Correcto!",
        explanation: "La consulta se ejecutó y muestra el tipo de resultado que pedía el ejercicio.",
        nearMiss: false,
        missingKeywords,
        missingColumns,
      };
    }
  }

  if (input.expectedRows) {
    const comparison = compareBags(
      input.userRows,
      input.expectedRows,
      rules.ignoreRowOrder ?? rules.matchMode !== "ordered",
      rules.allowExtraColumns === false ? rules.requiredColumns : rules.requiredColumns
    );
    if (comparison.equal && missingKeywords.length === 0) {
      return {
        status: "correct",
        message: "¡Correcto!",
        explanation: "El resultado coincide con el objetivo, aunque tu SQL no sea idéntico a la solución de referencia. Eso está bien: hay más de una forma correcta.",
        nearMiss: false,
        missingKeywords,
        missingColumns,
      };
    }
    if (comparison.missing === 0 && comparison.extra > 0) {
      return {
        status: "partial",
        message: "Vas cerca: revisa el filtro o la agrupación.",
        explanation: "Aparecen las filas esperadas y también algunas de más. Ajusta WHERE, DISTINCT, HAVING o JOIN.",
        nearMiss: true,
        missingKeywords,
        missingColumns,
      };
    }
    if (comparison.extra === 0 && comparison.missing > 0 && input.userRows.length > 0) {
      return {
        status: "partial",
        message: "Vas cerca: el resultado está incompleto.",
        explanation: "Faltan filas. Puede ser un filtro demasiado estricto, un INNER JOIN que descarta nulos o un LIKE demasiado específico.",
        nearMiss: true,
        missingKeywords,
        missingColumns,
      };
    }
    if (input.userRows.length > 0 && missingKeywords.length === 0) {
      return {
        status: "incorrect",
        message: "La consulta corre, pero el resultado no coincide todavía.",
        explanation: "Compara las columnas y las condiciones con el objetivo en palabras. Usa el explorador si dudas del nombre de una tabla.",
        nearMiss: false,
        missingKeywords,
        missingColumns,
      };
    }
  }

  if (missingKeywords.length > 0) {
    return {
      status: "incorrect",
      message: "Todavía falta el concepto principal de este ejercicio.",
      explanation: `Incluye ${missingKeywords.join(", ")} de forma consciente, no solo un resultado parecido.`,
      nearMiss: false,
      missingKeywords,
      missingColumns,
    };
  }

  if (input.userRows.length > 0) {
    return {
      status: "correct",
      message: "¡Correcto!",
      explanation: "La consulta cumple las reglas del ejercicio.",
      nearMiss: false,
      missingKeywords,
      missingColumns,
    };
  }

  return {
    status: "incorrect",
    message: "Aún no vemos el resultado esperado.",
    explanation: "Ejecuta una consulta que devuelva filas relacionadas con el objetivo, o revisa el FROM y el WHERE.",
    nearMiss: false,
    missingKeywords,
    missingColumns,
  };
}

import { getDefaultSchema, prisma } from "@/lib/db";

export type ColumnMeta = {
  name: string;
  dataType: string;
  isNullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: { schema: string; table: string; column: string };
};

export type TableMeta = {
  schema: string;
  name: string;
  type: string;
  columns: ColumnMeta[];
  primaryKey: string[];
  foreignKeys: Array<{
    column: string;
    schema: string;
    table: string;
    referencedColumn: string;
  }>;
};

export type SchemaGraph = {
  schema: string;
  tables: TableMeta[];
  relations: Array<{ from: string; to: string; fromColumn: string; toColumn: string }>;
};

type ColumnRow = {
  table_name: string;
  table_schema: string;
  table_type: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
};

type ConstraintRow = {
  table_name: string;
  column_name: string;
  constraint_type: string;
  foreign_table_schema: string | null;
  foreign_table_name: string | null;
  foreign_column_name: string | null;
};

export async function listSchemas() {
  const rows = await prisma.$queryRawUnsafe<Array<{ schema_name: string }>>(
    `SELECT schema_name
     FROM information_schema.schemata
     WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
     ORDER BY schema_name`
  );
  return rows.map((row) => row.schema_name);
}

export async function loadSchemaGraph(schema = getDefaultSchema()): Promise<SchemaGraph> {
  const columns = await prisma.$queryRawUnsafe<ColumnRow[]>(
    `SELECT c.table_schema, c.table_name, t.table_type, c.column_name, c.data_type, c.is_nullable, c.column_default
     FROM information_schema.columns c
     JOIN information_schema.tables t
       ON t.table_schema = c.table_schema AND t.table_name = c.table_name
     WHERE c.table_schema = $1
     ORDER BY c.table_name, c.ordinal_position`,
    schema
  );

  const constraints = await prisma.$queryRawUnsafe<ConstraintRow[]>(
    `SELECT
        kcu.table_name,
        kcu.column_name,
        tc.constraint_type,
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
     LEFT JOIN information_schema.constraint_column_usage ccu
       ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
     WHERE tc.table_schema = $1
       AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')`,
    schema
  );

  const tables = new Map<string, TableMeta>();
  for (const column of columns) {
    const current = tables.get(column.table_name) ?? {
      schema: column.table_schema,
      name: column.table_name,
      type: column.table_type,
      columns: [],
      primaryKey: [],
      foreignKeys: [],
    };
    current.columns.push({
      name: column.column_name,
      dataType: column.data_type,
      isNullable: column.is_nullable === "YES",
      defaultValue: column.column_default,
      isPrimaryKey: false,
      isForeignKey: false,
    });
    tables.set(column.table_name, current);
  }

  for (const constraint of constraints) {
    const table = tables.get(constraint.table_name);
    if (!table) continue;
    const column = table.columns.find((item) => item.name === constraint.column_name);
    if (constraint.constraint_type === "PRIMARY KEY") {
      if (column) column.isPrimaryKey = true;
      if (!table.primaryKey.includes(constraint.column_name)) {
        table.primaryKey.push(constraint.column_name);
      }
    }
    if (
      constraint.constraint_type === "FOREIGN KEY" &&
      constraint.foreign_table_name &&
      constraint.foreign_column_name
    ) {
      if (column) {
        column.isForeignKey = true;
        column.references = {
          schema: constraint.foreign_table_schema || schema,
          table: constraint.foreign_table_name,
          column: constraint.foreign_column_name,
        };
      }
      table.foreignKeys.push({
        column: constraint.column_name,
        schema: constraint.foreign_table_schema || schema,
        table: constraint.foreign_table_name,
        referencedColumn: constraint.foreign_column_name,
      });
    }
  }

  const tableList = [...tables.values()].sort((a, b) => a.name.localeCompare(b.name));
  const relations = tableList.flatMap((table) =>
    table.foreignKeys.map((fk) => ({
      from: table.name,
      to: fk.table,
      fromColumn: fk.column,
      toColumn: fk.referencedColumn,
    }))
  );

  return { schema, tables: tableList, relations };
}

export async function previewTable(schema: string, table: string, limit = 50) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const graph = await loadSchemaGraph(schema);
  const meta = graph.tables.find((item) => item.name === table);
  if (!meta) {
    throw new Error(`La tabla ${schema}.${table} no existe.`);
  }
  const quoted = `"${schema.replaceAll('"', "")}"."${table.replaceAll('"', "")}"`;
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT * FROM ${quoted} LIMIT ${safeLimit}`
  );
  return {
    table: meta,
    rows,
    rowCount: rows.length,
    limit: safeLimit,
  };
}

export function exampleQuestionsForTable(table: TableMeta): string[] {
  const names = table.columns.map((column) => column.name.toLowerCase());
  const questions = [`¿Cuántas filas hay en ${table.name}?`];
  if (names.some((name) => name.includes("name") || name.includes("nombre"))) {
    questions.push(`¿Cuáles son los nombres únicos en ${table.name}?`);
  }
  if (names.some((name) => name.includes("price") || name.includes("precio") || name.includes("amount"))) {
    questions.push(`¿Cuál es el valor mínimo, máximo y promedio de precio o monto en ${table.name}?`);
  }
  if (names.some((name) => name.includes("date") || name.includes("created") || name.includes("at"))) {
    questions.push(`¿Cuáles son los registros más recientes de ${table.name}?`);
  }
  if (table.foreignKeys.length > 0) {
    const related = table.foreignKeys[0];
    questions.push(`¿Cómo se relaciona ${table.name} con ${related.table} mediante ${related.column}?`);
  }
  if (names.includes("email")) {
    questions.push(`¿Qué correos de ${table.name} no tienen teléfono o datos opcionales?`);
  }
  return questions.slice(0, 4);
}

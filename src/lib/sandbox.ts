import { prisma } from "@/lib/db";

export async function resetSandbox() {
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'sql_playground'
      ) LOOP
        EXECUTE format('DROP TABLE IF EXISTS sql_playground.%I CASCADE', r.tablename);
      END LOOP;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE sql_playground.practice_customers (
      practice_id SERIAL PRIMARY KEY,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      city VARCHAR(80),
      notes VARCHAR(200)
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE sql_playground.practice_menu_items (
      practice_id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      price DECIMAL(8,2) NOT NULL,
      category VARCHAR(80) NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO sql_playground.practice_customers (first_name, last_name, email, city, notes)
    VALUES
      ('Nora', 'Prueba', 'nora.prueba@sandbox.dev', 'Puebla', 'Cliente ficticio inicial'),
      ('Omar', 'Demo', 'omar.demo@sandbox.dev', 'CDMX', NULL),
      ('Pia', 'Sandbox', 'pia.sandbox@sandbox.dev', 'Oaxaca', 'No borrar en ejercicios de INSERT');
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO sql_playground.practice_menu_items (name, price, category)
    VALUES
      ('Latte de práctica', 49, 'Bebidas con leche'),
      ('Galleta de práctica', 22, 'Repostería');
  `);

  return { ok: true as const, schema: "sql_playground" };
}

export async function tableExists(schema: string, table: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = $1 AND table_name = $2
     ) AS exists`,
    schema,
    table
  );
  return Boolean(rows[0]?.exists);
}

export async function columnExists(schema: string, table: string, column: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2 AND column_name = $3
     ) AS exists`,
    schema,
    table,
    column
  );
  return Boolean(rows[0]?.exists);
}

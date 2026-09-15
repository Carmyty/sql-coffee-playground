# SQL Coffee Playground

App web para practicar SQL con una base de datos de cadena de cafeterías (`coffee_chain`). Incluye módulos progresivos, pistas locales (sin IA), explorador de esquema, laboratorio libre y un sandbox de escritura (`sql_playground`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- CodeMirror para el editor SQL
- Vitest para tests unitarios

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuración local

```bash
cp .env.example .env
# Edita DATABASE_URL con tu usuario/clave/host
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

La app arranca en [http://127.0.0.1:3456](http://127.0.0.1:3456).

### Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena PostgreSQL (obligatoria) |
| `SQL_DEFAULT_SCHEMA` | Esquema de lectura (default `coffee_chain`) |
| `SQL_SANDBOX_SCHEMA` | Esquema de escritura (default `sql_playground`) |
| `SQL_MAX_ROWS` | Tope de filas devueltas |
| `SQL_STATEMENT_TIMEOUT_MS` | Timeout por consulta |

## Qué incluye

- **Aprender:** ~60 ejercicios por temas (SELECT, JOIN, GROUP BY, subconsultas, ventana, DML seguro, etc.)
- **Barra de precisión en vivo:** mientras escribes, una barra verde/ámbar/roja orienta con heurísticas locales (palabras clave pedidas, tablas sugeridas, señales estructurales). **No usa IA** y **no exige una query idéntica** a la de referencia: la validación final es por resultado al ejecutar.
- **Explorar:** esquema vía `information_schema`, columnas, FKs y preview de datos
- **Lab:** consultas libres; lectura en `coffee_chain`, mutaciones solo en `sql_playground`
- **Lecciones:** teoría corta ligada a cada módulo

## Seguridad SQL

- Solo un statement por ejecución
- SELECT contra `coffee_chain`
- INSERT/UPDATE/DELETE solo en `sql_playground`, con `WHERE` obligatorio en UPDATE/DELETE
- Bloqueo de DDL peligroso (`DROP SCHEMA`, etc.) y timeout/límite de filas
- Reset del sandbox desde el lab

## Scripts

```bash
npm run dev          # http://127.0.0.1:3456
npm run build
npm run lint
npm run typecheck
npm test
npm run db:migrate
npm run db:seed
```

## Deploy (Vercel)

1. Crea un Postgres alojado (Neon, Supabase o Vercel Postgres) y copia la `DATABASE_URL`.
2. En Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL` (obligatoria, connection string con SSL si aplica)
   - `SQL_DEFAULT_SCHEMA=coffee_chain`
   - `SQL_SANDBOX_SCHEMA=sql_playground`
   - `SQL_MAX_ROWS=200`
   - `SQL_STATEMENT_TIMEOUT_MS=8000`
3. Build Command: `prisma generate && prisma migrate deploy && next build` (también en `vercel.json`).
4. Tras el primer deploy, ejecuta el seed una vez (localmente contra la DB remota):

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

Eso carga `coffee_chain` (clientes, tiendas, menú, pedidos, etc.) y el sandbox `sql_playground`.

## GitHub

Publica el repo desde Cursor (Create repo) o:

```bash
gh auth login
gh repo create sql-coffee-playground --public --source=. --remote=github --push
```

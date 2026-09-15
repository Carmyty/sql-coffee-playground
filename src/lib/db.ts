import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function getDefaultSchema() {
  return process.env.SQL_DEFAULT_SCHEMA || "coffee_chain";
}

export function getSandboxSchema() {
  return process.env.SQL_SANDBOX_SCHEMA || "sql_playground";
}

export function getMaxRows() {
  const parsed = Number(process.env.SQL_MAX_ROWS || 200);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 500) : 200;
}

export function getStatementTimeoutMs() {
  const parsed = Number(process.env.SQL_STATEMENT_TIMEOUT_MS || 8000);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 8000;
}

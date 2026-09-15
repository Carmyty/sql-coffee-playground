import { describe, expect, it } from "vitest";
import {
  classifyStatement,
  hasWhereClause,
  inspectSql,
  splitSqlStatements,
  stripSqlComments,
} from "@/lib/sql-guard";

const options = {
  readSchema: "coffee_chain",
  sandboxSchema: "sql_playground",
} as const;

describe("sql-guard", () => {
  it("strips comments used to hide DROP SCHEMA", () => {
    const sql = "SELECT 1; /* DROP SCHEMA coffee_chain */";
    expect(stripSqlComments(sql)).not.toMatch(/DROP SCHEMA coffee_chain/);
  });

  it("rejects multiple statements", () => {
    const result = inspectSql("SELECT 1; SELECT 2;", { mode: "read", ...options });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "multiple_statements")).toBe(true);
  });

  it("blocks DROP SCHEMA even inside comments plus real statement", () => {
    const result = inspectSql("DROP SCHEMA coffee_chain CASCADE", { mode: "sandbox", ...options });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "drop_schema")).toBe(true);
  });

  it("blocks TRUNCATE", () => {
    const result = inspectSql("TRUNCATE coffee_chain.customers", { mode: "sandbox", ...options });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "truncate")).toBe(true);
  });

  it("blocks UPDATE without WHERE", () => {
    const result = inspectSql("UPDATE practice_customers SET city = 'X'", {
      mode: "sandbox",
      ...options,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "missing_where")).toBe(true);
  });

  it("blocks DELETE without WHERE", () => {
    const result = inspectSql("DELETE FROM practice_customers", { mode: "sandbox", ...options });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "missing_where")).toBe(true);
  });

  it("allows UPDATE with WHERE in sandbox", () => {
    const result = inspectSql(
      "UPDATE practice_customers SET city = 'X' WHERE email = 'a@b.c'",
      { mode: "sandbox", ...options }
    );
    expect(result.ok).toBe(true);
    expect(result.kind).toBe("update");
  });

  it("does not treat UPDATE SET as a blocked SET command", () => {
    const result = inspectSql(
      "UPDATE practice_customers SET notes = 'hola' WHERE practice_id = 1",
      { mode: "sandbox", ...options }
    );
    expect(result.issues.some((issue) => issue.code === "set_reset")).toBe(false);
    expect(result.ok).toBe(true);
  });

  it("blocks writes against coffee_chain even in sandbox mode", () => {
    const result = inspectSql(
      "DELETE FROM coffee_chain.customers WHERE customer_id = 1",
      { mode: "sandbox", ...options }
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "write_protected_schema")).toBe(true);
  });

  it("blocks writes against quoted protected schemas", () => {
    const result = inspectSql(
      'DELETE FROM "coffee_chain"."customers" WHERE customer_id = 1',
      { mode: "sandbox", ...options }
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "write_protected_schema")).toBe(true);
  });

  it("blocks mutations in read mode", () => {
    const result = inspectSql(
      "INSERT INTO practice_customers (first_name, last_name, email) VALUES ('A','B','a@b.c')",
      { mode: "read", ...options }
    );
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "write_on_read")).toBe(true);
  });

  it("allows SELECT in read mode", () => {
    const result = inspectSql("SELECT first_name, email FROM customers LIMIT 5", {
      mode: "read",
      ...options,
    });
    expect(result.ok).toBe(true);
    expect(result.kind).toBe("select");
  });

  it("classifies WITH as select", () => {
    expect(classifyStatement("WITH x AS (SELECT 1) SELECT * FROM x")).toBe("select");
  });

  it("classifies data-modifying CTEs as mutations", () => {
    expect(
      classifyStatement(
        "WITH removed AS (DELETE FROM practice_customers WHERE practice_id = 1 RETURNING *) SELECT * FROM removed"
      )
    ).toBe("delete");
  });

  it("detects WHERE at top level", () => {
    expect(hasWhereClause("SELECT * FROM t WHERE id = 1")).toBe(true);
    expect(hasWhereClause("SELECT * FROM t WHERE id IN (SELECT id FROM u WHERE x = 1)")).toBe(true);
    expect(hasWhereClause("DELETE FROM t")).toBe(false);
  });

  it("splits statements without breaking strings", () => {
    expect(splitSqlStatements("SELECT 'a;b'; SELECT 2")).toEqual(["SELECT 'a;b'", "SELECT 2"]);
  });

  it("blocks commented DROP SCHEMA when not fully stripped from executable sql", () => {
    const result = inspectSql("-- DROP SCHEMA coffee_chain\nSELECT 1", { mode: "read", ...options });
    expect(result.ok).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { findKeywords, normalizeSql, validateAttempt } from "@/lib/sql-validator";

describe("sql-validator", () => {
  it("accepts equivalent results with different aliases and column order", () => {
    const result = validateAttempt({
      userSql: "SELECT email AS correo, first_name AS nombre FROM customers",
      userRows: [
        { correo: "ana@mail.dev", nombre: "Ana" },
        { correo: "bruno@mail.dev", nombre: "Bruno" },
      ],
      expectedRows: [
        { first_name: "Ana", email: "ana@mail.dev" },
        { first_name: "Bruno", email: "bruno@mail.dev" },
      ],
      rules: {
        requiredColumns: ["nombre", "correo"],
        ignoreRowOrder: true,
        matchMode: "set",
      },
    });
    expect(result.status).toBe("correct");
  });

  it("gives partial credit when extra rows remain", () => {
    const result = validateAttempt({
      userSql: "SELECT name FROM menu_items",
      userRows: [{ name: "Latte" }, { name: "Mocha" }, { name: "Espresso" }],
      expectedRows: [{ name: "Latte" }, { name: "Mocha" }],
      rules: { ignoreRowOrder: true, matchMode: "set", requiredColumns: ["name"] },
    });
    expect(result.status).toBe("partial");
  });

  it("requires keywords even if the numbers look right", () => {
    const result = validateAttempt({
      userSql: "SELECT category_id, COUNT(*) FROM menu_items GROUP BY category_id",
      userRows: [{ category_id: 1, count: 4 }],
      expectedRows: [{ category_id: 1, count: 4 }],
      rules: {
        requiredKeywords: ["having"],
        ignoreRowOrder: true,
        matchMode: "set",
      },
    });
    expect(result.status).toBe("partial");
    expect(result.missingKeywords).toContain("having");
  });

  it("marks execution errors", () => {
    const result = validateAttempt({
      userSql: "SELEC boom",
      userRows: [],
      userError: "syntax error",
      rules: {},
    });
    expect(result.status).toBe("error");
  });

  it("validates mutation success", () => {
    const result = validateAttempt({
      userSql: "INSERT INTO practice_customers (first_name, last_name, email) VALUES ('A','B','a@b.c')",
      userRows: [],
      mutationOk: true,
      rules: { matchMode: "mutation", requiredKeywords: ["insert"] },
    });
    expect(result.status).toBe("correct");
  });

  it("does not treat a random SELECT 1 as a near miss for minRows exercises", () => {
    const result = validateAttempt({
      userSql: "SELECT 1",
      userRows: [{ "?column?": 1 }],
      rules: {
        requiredKeywords: ["select", "from"],
        minRows: 10,
        matchMode: "set",
      },
    });
    expect(result.status).toBe("incorrect");
    expect(result.nearMiss).toBe(false);
    expect(result.missingKeywords).toContain("from");
  });

  it("marks few rows as near miss when keywords are already present", () => {
    const result = validateAttempt({
      userSql: "SELECT * FROM customers WHERE city = 'Nowhere'",
      userRows: [],
      rules: {
        requiredKeywords: ["select", "from", "where"],
        minRows: 5,
        matchMode: "set",
      },
    });
    expect(result.status).toBe("partial");
    expect(result.nearMiss).toBe(true);
  });

  it("finds multi-word keywords", () => {
    expect(findKeywords("SELECT * FROM a GROUP BY b HAVING COUNT(*) > 1", ["group by", "having"])).toEqual([
      "group by",
      "having",
    ]);
  });

  it("normalizes sql noise", () => {
    expect(normalizeSql("SELECT   *  -- comment\nFROM customers")).toBe("select * from customers");
  });
});

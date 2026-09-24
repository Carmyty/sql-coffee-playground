import { describe, expect, it } from "vitest";
import { translateTsqlToPostgres } from "@/lib/tsql/translate";

describe("translateTsqlToPostgres", () => {
  it("converts TOP to LIMIT", () => {
    const { sql } = translateTsqlToPostgres("SELECT TOP 10 order_id FROM orders ORDER BY order_date DESC");
    expect(sql.toLowerCase()).toContain("limit 10");
    expect(sql.toLowerCase()).not.toContain("top 10");
  });

  it("converts LIKE to ILIKE", () => {
    const { sql } = translateTsqlToPostgres("SELECT name FROM menu_items WHERE name LIKE '%café%'");
    expect(sql.toLowerCase()).toContain("ilike");
  });

  it("converts GETDATE and ISNULL", () => {
    const { sql } = translateTsqlToPostgres("SELECT ISNULL(city, 'N/A'), GETDATE() FROM customers");
    expect(sql.toLowerCase()).toContain("coalesce");
    expect(sql.toLowerCase()).toContain("now()");
  });

  it("converts IDENTITY DDL", () => {
    const { sql } = translateTsqlToPostgres(
      "CREATE TABLE tasting_notes (note_id INT IDENTITY(1,1) PRIMARY KEY, flavor NVARCHAR(100))"
    );
    expect(sql.toLowerCase()).toContain("serial");
    expect(sql.toLowerCase()).toContain("varchar");
  });
});

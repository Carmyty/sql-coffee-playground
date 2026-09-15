import { describe, expect, it } from "vitest";
import { scoreLiveAccuracy } from "@/lib/live-accuracy";

const base = {
  suggestedTables: ["customers"],
  concepts: ["select", "from"],
  environment: "read" as const,
  validation: {
    requiredKeywords: ["select", "from"],
    matchMode: "set" as const,
  },
};

describe("scoreLiveAccuracy", () => {
  it("starts empty", () => {
    const result = scoreLiveAccuracy("", base);
    expect(result.score).toBe(0);
    expect(result.tone).toBe("empty");
  });

  it("rewards flexible correct structure without matching a single solution", () => {
    const a = scoreLiveAccuracy("SELECT * FROM customers", base);
    const b = scoreLiveAccuracy(
      "select first_name, email from customers order by first_name",
      base
    );
    expect(a.score).toBeGreaterThan(70);
    expect(b.score).toBeGreaterThan(70);
    expect(a.tone).toBe("green");
  });

  it("penalizes missing required keywords", () => {
    const missing = scoreLiveAccuracy("SELECT * FROM orders", {
      ...base,
      suggestedTables: ["customers"],
      validation: { requiredKeywords: ["select", "from", "where"], matchMode: "set" },
    });
    expect(missing.score).toBeLessThan(80);
    expect(missing.tips.join(" ")).toMatch(/WHERE/i);
  });

  it("scores a lab-style query on structure only, without requiring every table", () => {
    const lab = {
      suggestedTables: [] as string[],
      concepts: [] as string[],
      environment: "read" as const,
      validation: { requiredKeywords: ["select", "from"], matchMode: "exists" as const },
    };
    const good = scoreLiveAccuracy("SELECT name, city FROM stores LIMIT 10", lab);
    const bad = scoreLiveAccuracy("SELECT 1", lab);
    expect(good.tone).toBe("green");
    expect(bad.score).toBeLessThan(good.score);
  });

  it("accepts UNION without requiring a literal reference query", () => {
    const result = scoreLiveAccuracy(
      "SELECT first_name FROM customers UNION SELECT first_name FROM employees",
      {
        ...base,
        suggestedTables: ["customers", "employees"],
        concepts: ["union"],
        validation: {
          requiredKeywords: ["union"],
          forbiddenKeywords: ["union all"],
          matchMode: "set",
        },
      }
    );
    expect(result.score).toBeGreaterThan(50);
  });
});

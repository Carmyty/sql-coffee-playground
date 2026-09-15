import { NextResponse } from "next/server";
import { explainSql, improvementHint } from "@/lib/query-explainer";
import { getOptionalTutor } from "@/lib/ai/optional-tutor";

export async function POST(request: Request) {
  const body = (await request.json()) as { sql?: string; kind?: "explain" | "hint" };
  const sql = body.sql || "";
  const kind = body.kind || "explain";
  const local =
    kind === "hint"
      ? { summary: "Pistas para mejorar, sin reescribir tu consulta.", clauses: improvementHint(sql).map((text) => ({ title: "Pista", text })) }
      : explainSql(sql);

  const tutor = getOptionalTutor();
  return NextResponse.json({
    ok: true,
    source: tutor.enabled ? "local+ai-ready" : "local",
    aiEnabled: tutor.enabled,
    ...local,
  });
}

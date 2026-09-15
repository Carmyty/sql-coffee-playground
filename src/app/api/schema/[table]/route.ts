import { NextResponse } from "next/server";
import { exampleQuestionsForTable, previewTable } from "@/lib/schema-explorer";
import { getDefaultSchema } from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await context.params;
    const url = new URL(request.url);
    const schema = url.searchParams.get("schema") || getDefaultSchema();
    const preview = await previewTable(schema, table, 50);
    return NextResponse.json({
      ok: true,
      ...preview,
      questions: exampleQuestionsForTable(preview.table),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo previsualizar la tabla.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

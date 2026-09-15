import { NextResponse } from "next/server";
import { listSchemas, loadSchemaGraph } from "@/lib/schema-explorer";
import { getDefaultSchema } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const schema = url.searchParams.get("schema") || getDefaultSchema();
    const [schemas, graph] = await Promise.all([listSchemas(), loadSchemaGraph(schema)]);
    return NextResponse.json({ ok: true, schemas, graph });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer el esquema.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        beginnerHint:
          "Comprueba DATABASE_URL y que PostgreSQL esté encendido. El explorador lee information_schema, no asume columnas.",
      },
      { status: 500 }
    );
  }
}

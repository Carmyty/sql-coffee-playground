import { NextResponse } from "next/server";
import { executeSql } from "@/lib/sql-executor";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sql?: string;
      mode?: "read" | "sandbox" | "auto";
      schema?: string;
      confirmMutation?: boolean;
    };
    if (!body.sql || typeof body.sql !== "string") {
      return NextResponse.json({ ok: false, error: { message: "Falta la consulta SQL." } }, { status: 400 });
    }
    const result = await executeSql({
      sql: body.sql,
      mode: body.mode ?? "auto",
      schema: body.schema,
      confirmMutation: body.confirmMutation,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo ejecutar la consulta.";
    return NextResponse.json({ ok: false, error: { message, beginnerHint: "Revisa la conexión DATABASE_URL." } }, { status: 500 });
  }
}

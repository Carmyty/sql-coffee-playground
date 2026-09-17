import { NextResponse } from "next/server";
import { getExpectedPreview } from "@/lib/exercise-runner";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get("exerciseId");
    if (!exerciseId) {
      return NextResponse.json({ ok: false, error: "Falta exerciseId." }, { status: 400 });
    }
    const preview = await getExpectedPreview(exerciseId);
    if (!preview.ok) {
      return NextResponse.json(preview, { status: preview.error === "Ejercicio no encontrado" ? 404 : 200 });
    }
    return NextResponse.json(preview);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar el resultado esperado.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

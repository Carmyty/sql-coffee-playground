import { NextResponse } from "next/server";
import { validateExerciseAttempt } from "@/lib/exercise-runner";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      exerciseId?: string;
      sql?: string;
      confirmMutation?: boolean;
      schema?: string;
      unlockSolution?: boolean;
    };
    if (!body.exerciseId || !body.sql) {
      return NextResponse.json({ ok: false, error: "Faltan exerciseId o sql." }, { status: 400 });
    }
    const result = await validateExerciseAttempt({
      exerciseId: body.exerciseId,
      sql: body.sql,
      confirmMutation: body.confirmMutation,
      schema: body.schema,
      unlockSolution: body.unlockSolution,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo validar el ejercicio.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

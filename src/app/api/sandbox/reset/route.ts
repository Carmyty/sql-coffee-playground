import { NextResponse } from "next/server";
import { resetSandbox } from "@/lib/sandbox";

export async function POST() {
  try {
    const result = await resetSandbox();
    return NextResponse.json({
      ...result,
      message: "Sandbox restablecido: practice_customers y practice_menu_items volvieron a su estado inicial.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo restablecer el sandbox.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

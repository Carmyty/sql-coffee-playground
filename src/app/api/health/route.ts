import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sin conexión";
    return NextResponse.json({ ok: false, database: false, error: message }, { status: 503 });
  }
}

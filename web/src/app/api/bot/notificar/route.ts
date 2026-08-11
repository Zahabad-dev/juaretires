import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const telefono = String(body.telefono || "").replace(/\+/g, "").trim();
  const asesor = String(body.asesor || "").trim();

  if (!telefono) {
    return NextResponse.json({ error: "telefono es obligatorio" }, { status: 400 });
  }

  const result = await query<{ id: number }>(
    `UPDATE solicitudes
     SET asesor = COALESCE(NULLIF($1, ''), asesor), notificado = false, actualizado = NOW()
     WHERE telefono = $2
     RETURNING id`,
    [asesor, telefono]
  );

  return NextResponse.json({ ok: true, id: result.rows[0]?.id ?? null });
}

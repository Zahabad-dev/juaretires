import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await query(
    `SELECT pregunta, respuesta FROM faq WHERE activo = true ORDER BY id`
  );
  return NextResponse.json(result.rows);
}

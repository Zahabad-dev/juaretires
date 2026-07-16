import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const ESTADOS_VALIDOS = ["Nuevo", "Escalado", "Atendido", "Cerrado"];

export async function POST(req: Request) {
  const body = await req.json();
  const telefono = String(body.telefono || "").replace(/\+/g, "").trim();
  if (!telefono) {
    return NextResponse.json({ error: "telefono es obligatorio" }, { status: 400 });
  }

  const nombre = String(body.nombre || "");
  const estadoRaw = String(body.estado || "Nuevo");
  const estado = ESTADOS_VALIDOS.includes(estadoRaw) ? estadoRaw : "Nuevo";
  const prioridad = body.intencion_compra ? "ALTA" : "MEDIA";
  const descripcion = String(body.descripcion || "").slice(0, 1000);
  const ultimoMensaje = String(body.ultimo_mensaje || "").slice(0, 1000);

  const result = await query<{ id: number }>(
    `INSERT INTO solicitudes (telefono, nombre, productos, ultimo_mensaje, canal, estado, prioridad, actualizado)
     VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), NULLIF($4, ''), 'whatsapp', $5, $6, NOW())
     ON CONFLICT (telefono) DO UPDATE SET
       nombre         = COALESCE(NULLIF($2, ''), solicitudes.nombre),
       productos      = COALESCE(NULLIF($3, ''), solicitudes.productos),
       ultimo_mensaje = COALESCE(NULLIF($4, ''), solicitudes.ultimo_mensaje),
       estado         = $5,
       prioridad      = $6,
       actualizado    = NOW()
     RETURNING id`,
    [telefono, nombre, descripcion, ultimoMensaje, estado, prioridad]
  );

  return NextResponse.json({ ok: true, id: result.rows[0]?.id });
}

import { NextResponse } from "next/server";
import { enviarPushATurno } from "@/lib/push";

export const dynamic = "force-dynamic";

const TURNOS_VALIDOS = ["a1", "a2", "a3", "a4", "a5"];

export async function POST(req: Request) {
  const body = await req.json();
  const turno = String(body.turno || "");
  const nombreCliente = String(body.nombre_cliente || "Cliente");
  const telefono = String(body.telefono || "");

  if (!TURNOS_VALIDOS.includes(turno)) {
    return NextResponse.json({ error: "turno inválido" }, { status: 400 });
  }

  try {
    const resultado = await enviarPushATurno(turno, {
      title: "Nuevo lead asignado",
      body: `${nombreCliente}${telefono ? " · " + telefono : ""} — entra al CRM para generar su cotización.`,
      url: "/crm/solicitudes",
    });
    return NextResponse.json({ ok: true, ...resultado });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 200 }
    );
  }
}

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { enviarPushATurno } from "@/lib/push";

export const dynamic = "force-dynamic";

interface PendienteRow {
  id: number;
  nombre: string | null;
  turno_asesor: string;
}

// Llamado cada 3 min por un Schedule Trigger de n8n. Busca cotizaciones que ya
// se armaron (tienen al menos un producto con precio real) pero el asesor no
// ha marcado como enviadas, y le manda un recordatorio push -- se repite cada
// vez que pasa este endpoint hasta que se marque como enviada.
export async function POST() {
  const pendientesRes = await query<PendienteRow>(
    `SELECT id, nombre, turno_asesor
     FROM solicitudes
     WHERE cotizacion_generada_en IS NOT NULL
       AND cotizacion_enviada = false
       AND turno_asesor IS NOT NULL
       AND COALESCE(cotizacion_recordatorio_en, cotizacion_generada_en) <= NOW() - INTERVAL '3 minutes'`
  );

  let enviados = 0;
  for (const s of pendientesRes.rows) {
    try {
      await enviarPushATurno(s.turno_asesor, {
        title: "Cotización pendiente de enviar",
        body: `${s.nombre || "Un cliente"} sigue esperando su cotización — mándasela por WhatsApp.`,
        url: `/crm/cotizacion/${s.id}`,
      });
      enviados++;
    } catch {
      // sigue con los demás aunque uno falle (ej. VAPID sin configurar)
    }
    await query(`UPDATE solicitudes SET cotizacion_recordatorio_en = NOW() WHERE id = $1`, [s.id]);
  }

  return NextResponse.json({ ok: true, revisadas: pendientesRes.rows.length, enviados });
}

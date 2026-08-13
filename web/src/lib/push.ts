import webpush from "web-push";
import { query } from "@/lib/db";

let configurado = false;

function asegurarConfig() {
  if (configurado) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no están configuradas.");
  }
  webpush.setVapidDetails("mailto:soporte@jaureautomotriz.com", publicKey, privateKey);
  configurado = true;
}

interface SubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function enviarPushATurno(
  turno: string,
  payload: { title: string; body: string; url?: string }
) {
  const username = "asesor" + turno.replace("a", "");
  const usuarioRes = await query<{ id: number }>(
    `SELECT id FROM crm_usuarios WHERE username = $1 AND activo = true`,
    [username]
  );
  const usuarioId = usuarioRes.rows[0]?.id;
  if (!usuarioId) return { enviados: 0, motivo: "usuario no encontrado" };

  return enviarPushAUsuario(usuarioId, payload);
}

export async function enviarPushAUsuario(
  usuarioId: number,
  payload: { title: string; body: string; url?: string }
) {
  asegurarConfig();

  const subsRes = await query<SubscriptionRow>(
    `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE usuario_id = $1`,
    [usuarioId]
  );

  let enviados = 0;
  for (const sub of subsRes.rows) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      );
      enviados++;
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Suscripción ya no válida (navegador la revocó) -- se limpia.
        await query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [sub.endpoint]);
      }
    }
  }
  return { enviados, total: subsRes.rows.length };
}

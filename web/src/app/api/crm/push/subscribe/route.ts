import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
  }

  const usuarioRes = await query<{ id: number }>(
    `SELECT id FROM crm_usuarios WHERE username = $1`,
    [session.user.email]
  );
  const usuarioId = usuarioRes.rows[0]?.id;
  if (!usuarioId) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  await query(
    `INSERT INTO push_subscriptions (usuario_id, endpoint, p256dh, auth)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (endpoint) DO UPDATE SET usuario_id = EXCLUDED.usuario_id`,
    [usuarioId, endpoint, keys.p256dh, keys.auth]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  const { endpoint } = body;
  if (!endpoint) return NextResponse.json({ error: "Falta endpoint" }, { status: 400 });

  await query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [endpoint]);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Se sirve desde el servidor (VAPID_PUBLIC_KEY, sin prefijo NEXT_PUBLIC_) en vez
// de depender de una variable inyectada en build time -- en Easypanel las
// variables de "Entorno" solo llegan al contenedor en ejecución, no al paso de
// `next build`, así que cualquier NEXT_PUBLIC_* quedaba horneada como undefined
// sin importar cuántas veces se redesplegara.
export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || null;
  return NextResponse.json({ publicKey });
}

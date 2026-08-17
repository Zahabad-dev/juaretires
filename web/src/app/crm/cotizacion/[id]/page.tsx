import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import CotizacionForm from "./cotizacion-form";

export const dynamic = "force-dynamic";

interface SolicitudRow {
  id: number;
  nombre: string | null;
  telefono: string;
  sin_iva: boolean;
  promocion_id: number | null;
  cotizacion_enviada: boolean;
  cotizacion_generada_en: Date | null;
}

interface ItemRow {
  producto: string;
  cantidad: number;
  precio_unitario: string | null;
  aplica_promocion: boolean;
}

interface PromocionRow {
  id: number;
  nombre: string;
  porcentaje: string;
  categoria: string;
}

export default async function CotizacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/crm/login");

  const { id } = await params;

  const solicitudRes = await query<SolicitudRow>(
    `SELECT id, nombre, telefono, sin_iva, promocion_id, cotizacion_enviada, cotizacion_generada_en
     FROM solicitudes WHERE id = $1`,
    [id]
  );
  const solicitud = solicitudRes.rows[0];
  if (!solicitud) notFound();

  const itemsRes = await query<ItemRow>(
    `SELECT producto, cantidad, precio_unitario, aplica_promocion FROM solicitud_items WHERE solicitud_id = $1 ORDER BY orden, id`,
    [id]
  );

  const itemsIniciales = itemsRes.rows.map((r) => ({
    producto: r.producto,
    cantidad: r.cantidad,
    precio: r.precio_unitario === null ? "" : String(r.precio_unitario),
    aplicaPromocion: r.aplica_promocion,
  }));

  const catalogoRes = await query<{ nombre: string; sku: string | null; precio_venta: string | null }>(
    `SELECT nombre, sku, precio_venta FROM kordata_productos_cache ORDER BY nombre`
  );
  const catalogo = catalogoRes.rows.map((r) => ({
    nombre: r.nombre,
    sku: r.sku,
    precio: r.precio_venta === null ? null : Number(r.precio_venta),
  }));

  const promocionesRes = await query<PromocionRow>(
    `SELECT id, nombre, porcentaje, categoria FROM promociones WHERE activo = true ORDER BY categoria, nombre`
  );
  const promociones = promocionesRes.rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    porcentaje: Number(r.porcentaje),
    categoria: r.categoria,
  }));

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div>
          <Link href="/crm/solicitudes" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl text-brand-text">
              Cotización — {solicitud.nombre || "Sin nombre"}
            </h1>
            {solicitud.cotizacion_generada_en && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-heading ${
                  solicitud.cotizacion_enviada
                    ? "bg-green-500/15 text-green-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {solicitud.cotizacion_enviada ? "✓ Enviada" : "⏳ Pendiente de enviar"}
              </span>
            )}
          </div>
          <p className="text-sm text-brand-text/50">{solicitud.telefono}</p>
        </div>

        <CotizacionForm
          solicitudId={String(solicitud.id)}
          itemsIniciales={itemsIniciales}
          catalogo={catalogo}
          sinIvaInicial={solicitud.sin_iva}
          cotizacionEnviadaInicial={solicitud.cotizacion_enviada}
          promociones={promociones}
          promocionIdInicial={solicitud.promocion_id}
        />
      </div>
    </div>
  );
}

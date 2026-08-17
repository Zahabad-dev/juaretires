import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import PromocionForm from "./promocion-form";

export const dynamic = "force-dynamic";

interface PromocionRow {
  id: number;
  nombre: string;
  porcentaje: string;
  categoria: string;
  activo: boolean;
}

const CATEGORIA_LABEL: Record<string, string> = {
  promocion: "Promoción",
  institucion: "Institución",
  cupon: "Cupón",
};

export default async function PromocionesPage() {
  const session = await auth();
  if (!session) redirect("/crm/login");
  if (session.user?.rol !== "admin" && session.user?.rol !== "agencia") redirect("/crm");

  const result = await query<PromocionRow>(
    `SELECT id, nombre, porcentaje, categoria, activo FROM promociones ORDER BY categoria, nombre`
  );

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <h1 className="mt-1 font-heading text-2xl text-brand-text">Promociones</h1>
          <p className="text-sm text-brand-text/50">
            Catálogo de promociones, instituciones y cupones que el vendedor puede aplicar al
            cotizar. En cada cotización solo se puede activar una a la vez — nunca se combinan.
          </p>
        </div>

        <PromocionForm categoriaLabel={CATEGORIA_LABEL} />

        <div className="flex flex-col gap-3">
          {result.rows.map((r) => (
            <PromocionForm
              key={r.id}
              id={r.id}
              nombre={r.nombre}
              porcentaje={r.porcentaje}
              categoria={r.categoria}
              activo={r.activo}
              categoriaLabel={CATEGORIA_LABEL}
            />
          ))}
        </div>
        {result.rows.length === 0 && (
          <p className="text-center text-brand-text/50">Sin promociones registradas todavía.</p>
        )}
      </div>
    </div>
  );
}

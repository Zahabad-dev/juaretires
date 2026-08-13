import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import ProductoForm from "./producto-form";
import SincronizarKordataButton from "./sincronizar-kordata-button";

export const dynamic = "force-dynamic";

interface ProductoRow {
  id: number;
  nombre: string;
  medida: string | null;
  descripcion: string;
  imagen: string;
  activo: boolean;
}

export default async function ProductosPage() {
  const session = await auth();
  if (!session) redirect("/crm/login");
  if (session.user?.rol !== "admin") redirect("/crm");

  const result = await query<ProductoRow>(
    `SELECT id, nombre, medida, descripcion, imagen, activo FROM productos_estrella ORDER BY orden`
  );

  const cacheInfo = await query<{ total: string; ultima: string | null }>(
    `SELECT COUNT(*)::text AS total, MAX(actualizado_en)::text AS ultima FROM kordata_productos_cache`
  );
  const totalCache = Number(cacheInfo.rows[0]?.total ?? 0);
  const ultimaSyncRaw = cacheInfo.rows[0]?.ultima ?? null;
  const ultimaSync = ultimaSyncRaw
    ? new Date(ultimaSyncRaw).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })
    : null;

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <h1 className="mt-1 font-heading text-2xl text-brand-text">Productos Estrella</h1>
          <p className="text-sm text-brand-text/50">
            Estos 5 productos aparecen en la página principal de jaureautomotriz.com.
          </p>
        </div>

        <SincronizarKordataButton totalCache={totalCache} ultimaSync={ultimaSync} />

        <div className="flex flex-col gap-4">
          {result.rows.map((p) => (
            <ProductoForm
              key={p.id}
              id={String(p.id)}
              nombre={p.nombre}
              medida={p.medida ?? ""}
              descripcion={p.descripcion}
              imagen={p.imagen}
              activo={p.activo}
            />
          ))}
        </div>
        {result.rows.length === 0 && (
          <p className="text-center text-brand-text/50">Sin registros.</p>
        )}
      </div>
    </div>
  );
}

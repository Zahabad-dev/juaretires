import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import AsesorNombreForm from "./asesor-nombre-form";

export const dynamic = "force-dynamic";

export default async function AsesoresPage() {
  const session = await auth();
  if (!session) redirect("/crm/login");
  if (session.user?.rol !== "admin") redirect("/crm");

  const result = await query<{ turno: string; nombre: string }>(
    `SELECT turno, nombre FROM asesores ORDER BY turno`
  );

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <h1 className="mt-1 font-heading text-2xl text-brand-text">Asesores</h1>
          <p className="text-sm text-brand-text/50">
            Nombre real de cada asesor en la rotación del bot (a1–a5).
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {result.rows.map((r) => (
            <AsesorNombreForm key={r.turno} turno={r.turno} nombre={r.nombre} />
          ))}
        </div>
        {result.rows.length === 0 && (
          <p className="text-center text-brand-text/50">
            Sin registros. Corre web/sql/migration-asesores-nombres.sql en la base de datos.
          </p>
        )}
      </div>
    </div>
  );
}

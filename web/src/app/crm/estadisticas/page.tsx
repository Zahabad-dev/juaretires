import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface KpiRow {
  total: string;
  hoy: string;
  semana: string;
  resueltos: string;
  pendientes: string;
}

interface AsesorRow {
  asesor: string;
  total: string;
  resueltos: string;
}

interface EstadoRow {
  estado: string;
  total: string;
}

interface TendenciaRow {
  dia: string;
  total: string;
}

interface ProductoRow {
  producto: string;
  total: string;
}

export default async function EstadisticasPage() {
  const session = await auth();
  if (!session) redirect("/crm/login");
  if (session.user?.rol !== "admin" && session.user?.rol !== "agencia") redirect("/crm");

  const [kpi, porAsesor, porEstado, tendencia, productos] = await Promise.all([
    query<KpiRow>(`
      SELECT
        COUNT(*)::text AS total,
        COUNT(*) FILTER (WHERE creado_en::date = CURRENT_DATE)::text AS hoy,
        COUNT(*) FILTER (WHERE creado_en >= date_trunc('week', CURRENT_DATE))::text AS semana,
        COUNT(*) FILTER (WHERE estado IN ('Atendido','Cerrado'))::text AS resueltos,
        COUNT(*) FILTER (WHERE prioridad = 'ALTA' OR estado = 'Escalado')::text AS pendientes
      FROM solicitudes
    `),
    query<AsesorRow>(`
      SELECT
        COALESCE(asesor, 'Sin asignar') AS asesor,
        COUNT(*)::text AS total,
        COUNT(*) FILTER (WHERE estado IN ('Atendido','Cerrado'))::text AS resueltos
      FROM solicitudes
      GROUP BY asesor
      ORDER BY COUNT(*) DESC
    `),
    query<EstadoRow>(`
      SELECT estado, COUNT(*)::text AS total
      FROM solicitudes
      GROUP BY estado
      ORDER BY COUNT(*) DESC
    `),
    query<TendenciaRow>(`
      SELECT date_trunc('day', creado_en)::date::text AS dia, COUNT(*)::text AS total
      FROM solicitudes
      WHERE creado_en >= CURRENT_DATE - INTERVAL '29 days'
      GROUP BY dia
      ORDER BY dia
    `),
    query<ProductoRow>(`
      SELECT producto, COUNT(*)::text AS total
      FROM solicitud_items
      GROUP BY producto
      ORDER BY COUNT(*) DESC
      LIMIT 8
    `),
  ]);

  const k = kpi.rows[0];
  const total = Number(k?.total ?? 0);
  const resueltos = Number(k?.resueltos ?? 0);
  const conversion = total > 0 ? Math.round((resueltos / total) * 100) : 0;

  // Rellena los 30 dias completos (los que no tuvieron leads no aparecen en la query)
  const tendenciaMap = new Map(tendencia.rows.map((r) => [r.dia, Number(r.total)]));
  const dias: { fecha: string; total: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dias.push({ fecha: key, total: tendenciaMap.get(key) ?? 0 });
  }
  const maxDia = Math.max(1, ...dias.map((d) => d.total));

  const maxAsesor = Math.max(1, ...porAsesor.rows.map((r) => Number(r.total)));
  const maxEstado = Math.max(1, ...porEstado.rows.map((r) => Number(r.total)));
  const maxProducto = Math.max(1, ...productos.rows.map((r) => Number(r.total)));

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <h1 className="mt-1 font-heading text-2xl text-brand-text">Estadísticas</h1>
          <p className="text-sm text-brand-text/50">Resumen general del CRM de JAURE.</p>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiTile label="Leads totales" value={total} />
          <KpiTile label="Hoy" value={Number(k?.hoy ?? 0)} />
          <KpiTile label="Esta semana" value={Number(k?.semana ?? 0)} />
          <KpiTile label="Conversión" value={`${conversion}%`} sub={`${resueltos} de ${total} resueltos`} />
          <KpiTile
            label="Pendientes urgentes"
            value={Number(k?.pendientes ?? 0)}
            acento={Number(k?.pendientes ?? 0) > 0}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Leads por asesor */}
          <Panel titulo="Leads por asesor">
            <div className="flex flex-col gap-3">
              {porAsesor.rows.map((r) => (
                <BarRow
                  key={r.asesor}
                  label={r.asesor}
                  value={Number(r.total)}
                  max={maxAsesor}
                  sublabel={`${r.resueltos} resueltos`}
                />
              ))}
              {porAsesor.rows.length === 0 && <SinDatos />}
            </div>
          </Panel>

          {/* Leads por estado */}
          <Panel titulo="Leads por estado">
            <div className="flex flex-col gap-3">
              {porEstado.rows.map((r) => (
                <BarRow key={r.estado} label={r.estado} value={Number(r.total)} max={maxEstado} />
              ))}
              {porEstado.rows.length === 0 && <SinDatos />}
            </div>
          </Panel>
        </div>

        {/* Tendencia 30 días */}
        <Panel titulo="Leads por día — últimos 30 días">
          <div className="flex h-32 items-end gap-1 overflow-x-auto pb-1">
            {dias.map((d) => (
              <div
                key={d.fecha}
                className="group relative flex min-w-[8px] flex-1 flex-col items-center justify-end"
                title={`${d.fecha}: ${d.total} leads`}
              >
                <div
                  className="w-full rounded-t bg-brand-primary transition-opacity group-hover:opacity-80"
                  style={{ height: `${Math.max(2, (d.total / maxDia) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-brand-text/40">
            <span>{dias[0]?.fecha}</span>
            <span>{dias[dias.length - 1]?.fecha}</span>
          </div>
        </Panel>

        {/* Medidas más consultadas */}
        <Panel titulo="Productos / medidas más consultados">
          <div className="flex flex-col gap-3">
            {productos.rows.map((r) => (
              <BarRow key={r.producto} label={r.producto} value={Number(r.total)} max={maxProducto} />
            ))}
            {productos.rows.length === 0 && <SinDatos />}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  acento,
}: {
  label: string;
  value: number | string;
  sub?: string;
  acento?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-brand-surface2 p-5">
      <span className="text-[11px] uppercase tracking-wide text-brand-text/40">{label}</span>
      <span className={`font-heading text-3xl ${acento ? "text-brand-primary" : "text-brand-text"}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-brand-text/40">{sub}</span>}
    </div>
  );
}

function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-brand-surface2 p-6">
      <h2 className="mb-4 font-heading text-sm uppercase tracking-wide text-brand-text/70">{titulo}</h2>
      {children}
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  sublabel,
}: {
  label: string;
  value: number;
  max: number;
  sublabel?: string;
}) {
  const pct = Math.max(2, (value / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-brand-text/80">{label}</span>
        <span className="shrink-0 font-heading text-brand-text">
          {value}
          {sublabel && <span className="ml-2 text-xs font-normal text-brand-text/40">{sublabel}</span>}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5">
        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SinDatos() {
  return <p className="text-sm text-brand-text/40">Sin datos todavía.</p>;
}

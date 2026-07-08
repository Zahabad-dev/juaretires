import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CRM_TABLES, CrmTableSlug, query } from "@/lib/db";
import EstadoSelect from "./estado-select";
import PrioridadSelect from "./prioridad-select";
import BotToggle from "./bot-toggle";
import EliminarButton from "./eliminar-button";
import CotizacionButton from "./cotizacion-button";
import FaqRowForm from "./faq-row-form";

export const dynamic = "force-dynamic";

const ROW_LIMIT = 100;

function isCrmTableSlug(v: string): v is CrmTableSlug {
  return v in CRM_TABLES;
}

export default async function CrmTablePage({
  params,
}: {
  params: Promise<{ tabla: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/crm/login");

  const { tabla } = await params;
  if (!isCrmTableSlug(tabla)) notFound();

  const info = CRM_TABLES[tabla];

  // --- FAQ: edición inline ---
  if (tabla === "faq") {
    const result = await query(
      `SELECT id, pregunta, respuesta, activo FROM faq ORDER BY id`
    );
    return (
      <div className="min-h-screen bg-brand-bg px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
              ← Volver
            </Link>
            <h1 className="mt-1 font-heading text-2xl text-brand-text">{info.label}</h1>
            <p className="text-sm text-brand-text/50">
              Edita o desactiva las FAQ que usa el agente IA.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {result.rows.map((row) => {
              const r = row as Record<string, unknown>;
              return (
                <FaqRowForm
                  key={String(r.id)}
                  id={String(r.id)}
                  pregunta={String(r.pregunta)}
                  respuesta={String(r.respuesta)}
                  activo={Boolean(r.activo)}
                />
              );
            })}
          </div>
          {result.rows.length === 0 && (
            <p className="text-center text-brand-text/50">Sin registros.</p>
          )}
        </div>
      </div>
    );
  }

  // --- Tabla genérica ---
  const result = await query(
    `SELECT * FROM ${info.table} ORDER BY 1 DESC LIMIT ${ROW_LIMIT}`
  );
  const columns = result.fields.map((f) => f.name);

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        <div className="flex items-center justify-between">
          <div>
            <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
              ← Volver
            </Link>
            <h1 className="mt-1 font-heading text-2xl text-brand-text">{info.label}</h1>
            <p className="text-sm text-brand-text/50">
              {info.table} · últimos {ROW_LIMIT} registros
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-brand-surface2 text-brand-primary">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 font-heading">
                    {col}
                  </th>
                ))}
                {tabla === "solicitudes" && (
                  <th className="whitespace-nowrap px-4 py-3 font-heading">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => {
                const r = row as Record<string, unknown>;
                return (
                  <tr
                    key={i}
                    className="border-t border-white/5 text-brand-text/80 odd:bg-white/[0.02]"
                  >
                    {columns.map((col) => {
                      if (tabla === "solicitudes" && col === "estado") {
                        return (
                          <td key={col} className="whitespace-nowrap px-4 py-2">
                            <EstadoSelect id={String(r.id)} value={String(r.estado)} />
                          </td>
                        );
                      }
                      if (tabla === "solicitudes" && col === "prioridad") {
                        return (
                          <td key={col} className="whitespace-nowrap px-4 py-2">
                            <PrioridadSelect id={String(r.id)} value={String(r.prioridad)} />
                          </td>
                        );
                      }
                      if (tabla === "solicitudes" && col === "bot_bloqueado") {
                        return (
                          <td key={col} className="whitespace-nowrap px-4 py-2">
                            <BotToggle id={String(r.id)} activo={!r.bot_bloqueado} />
                          </td>
                        );
                      }
                      return (
                        <td key={col} className="max-w-xs truncate whitespace-nowrap px-4 py-2">
                          {formatCell(r[col])}
                        </td>
                      );
                    })}

                    {tabla === "solicitudes" && (
                      <td className="whitespace-nowrap px-4 py-2">
                        <div className="flex items-center gap-2">
                          <CotizacionButton id={String(r.id)} />
                          <EliminarButton id={String(r.id)} />
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {result.rows.length === 0 && (
            <p className="px-4 py-6 text-center text-brand-text/50">Sin registros.</p>
          )}
        </div>

      </div>
    </div>
  );
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) return value.toLocaleString("es-MX");
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

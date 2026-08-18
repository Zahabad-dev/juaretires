import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CRM_TABLES, CrmTableSlug, query } from "@/lib/db";
import EstadoSelect from "./estado-select";
import PrioridadSelect from "./prioridad-select";
import BotToggle from "./bot-toggle";
import AsesorInput from "./asesor-input";
import EliminarButton from "./eliminar-button";
import CotizacionButton from "./cotizacion-button";
import FaqRowForm from "./faq-row-form";
import FaqNuevaForm from "./faq-nueva-form";
import NotificationBell from "@/app/crm/notification-bell";

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
    const puedeEditarFaq = session.user?.rol === "admin" || session.user?.rol === "agencia";
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
            {puedeEditarFaq && <FaqNuevaForm />}
            {result.rows.map((row) => {
              const r = row as Record<string, unknown>;
              return (
                <FaqRowForm
                  key={String(r.id)}
                  id={String(r.id)}
                  pregunta={String(r.pregunta)}
                  respuesta={String(r.respuesta)}
                  activo={Boolean(r.activo)}
                  puedeEditar={puedeEditarFaq}
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

  // Cada asesor (asesor1..asesor5) solo ve sus propios leads asignados.
  // Uriel (admin) y la cuenta genérica "ventas" ven todo.
  const username = session.user?.email || "";
  const miTurno = /^asesor[1-5]$/.test(username) ? username.replace("asesor", "a") : null;
  const vistaFiltrada = tabla === "solicitudes" && miTurno !== null;

  // --- Tabla genérica ---
  const result = vistaFiltrada
    ? await query(
        `SELECT * FROM ${info.table} WHERE turno_asesor = $1 ORDER BY 1 DESC LIMIT ${ROW_LIMIT}`,
        [miTurno]
      )
    : await query(`SELECT * FROM ${info.table} ORDER BY 1 DESC LIMIT ${ROW_LIMIT}`);
  const columns = result.fields.map((f) => f.name);

  // Entrar a solicitudes marca como vistos solo los leads que ese usuario puede ver
  if (tabla === "solicitudes") {
    if (vistaFiltrada) {
      await query(
        `UPDATE solicitudes SET notificado = true WHERE notificado = false AND turno_asesor = $1`,
        [miTurno]
      );
    } else {
      await query(`UPDATE solicitudes SET notificado = true WHERE notificado = false`);
    }
  }

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
              {vistaFiltrada ? "Tus leads asignados" : `${info.table} · últimos ${ROW_LIMIT} registros`}
            </p>
          </div>
          <NotificationBell />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-brand-surface2 text-brand-primary">
              <tr>
                {tabla === "solicitudes" && (
                  <th className="sticky left-0 z-10 whitespace-nowrap bg-brand-surface2 px-4 py-3 font-heading">
                    Acciones
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3 font-heading">
                    {col}
                  </th>
                ))}
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
                    {tabla === "solicitudes" && (
                      <td className="sticky left-0 z-10 whitespace-nowrap bg-brand-bg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <CotizacionButton id={String(r.id)} />
                          <EliminarButton id={String(r.id)} />
                        </div>
                      </td>
                    )}
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
                      if (tabla === "solicitudes" && col === "telefono") {
                        const numero = String(r.telefono || "").replace(/\D/g, "");
                        return (
                          <td key={col} className="whitespace-nowrap px-4 py-2">
                            <a
                              href={`https://wa.me/${numero}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-brand-green transition-opacity hover:opacity-80"
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.525 4.005 1.446 5.699L0 24l6.467-1.429A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.387l-.361-.214-3.735.825.84-3.639-.235-.374A9.818 9.818 0 1112 21.818z" />
                              </svg>
                              {String(r.telefono)}
                            </a>
                          </td>
                        );
                      }
                      if (tabla === "solicitudes" && col === "asesor") {
                        return (
                          <td key={col} className="whitespace-nowrap px-4 py-2">
                            <AsesorInput id={String(r.id)} value={r.asesor ? String(r.asesor) : ""} />
                          </td>
                        );
                      }
                      return (
                        <td key={col} className="max-w-xs truncate whitespace-nowrap px-4 py-2">
                          {formatCell(r[col])}
                        </td>
                      );
                    })}
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

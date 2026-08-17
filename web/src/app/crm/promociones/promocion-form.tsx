"use client";

import { useActionState } from "react";
import { eliminarPromocionAction, guardarPromocionAction } from "@/app/crm/actions";

export default function PromocionForm({
  id,
  nombre = "",
  porcentaje = "",
  categoria = "promocion",
  activo = true,
  categoriaLabel,
}: {
  id?: number;
  nombre?: string;
  porcentaje?: string;
  categoria?: string;
  activo?: boolean;
  categoriaLabel: Record<string, string>;
}) {
  const [state, action, pending] = useActionState(guardarPromocionAction, undefined);
  const esNueva = id === undefined;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-brand-surface2 p-4">
      <form action={action} className="flex flex-col gap-3">
        {id !== undefined && <input type="hidden" name="id" value={id} />}

        <div className="flex flex-wrap items-center gap-2">
          <input
            name="nombre"
            defaultValue={nombre}
            placeholder="Nombre (ej. Cruz Roja, Cupón Verano 2026)"
            className="min-w-[180px] flex-1 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          <input
            name="porcentaje"
            type="number"
            min={1}
            max={100}
            step="0.01"
            defaultValue={porcentaje}
            placeholder="%"
            className="w-20 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          <select
            name="categoria"
            defaultValue={categoria}
            className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
          >
            {Object.entries(categoriaLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex shrink-0 items-center gap-2 text-xs text-brand-text/60">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={activo}
              className="h-4 w-4 accent-brand-primary"
            />
            Activa
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
          {state?.success && <p className="text-xs text-green-400">Guardado</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Guardando…" : esNueva ? "Agregar" : "Guardar"}
          </button>
        </div>
      </form>

      {!esNueva && (
        <form
          action={eliminarPromocionAction}
          className="flex justify-end border-t border-white/10 pt-3"
        >
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm("¿Eliminar esta promoción?")) e.preventDefault();
            }}
            className="rounded-full border border-red-500/40 px-3 py-1.5 font-heading text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            Eliminar
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { actualizarAsesorNombreAction } from "@/app/crm/actions";

export default function AsesorNombreForm({
  turno,
  nombre,
}: {
  turno: string;
  nombre: string;
}) {
  const [state, action, pending] = useActionState(actualizarAsesorNombreAction, undefined);

  return (
    <form
      action={action}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-brand-surface2 p-4"
    >
      <input type="hidden" name="turno" value={turno} />
      <span className="w-14 shrink-0 font-heading text-sm text-brand-primary">{turno}</span>
      <input
        name="nombre"
        defaultValue={nombre}
        className="flex-1 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
        placeholder="Nombre real del asesor"
      />
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
      {state?.success && <p className="text-xs text-green-400">Guardado</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

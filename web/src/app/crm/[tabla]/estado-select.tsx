"use client";

import { actualizarEstadoAction } from "@/app/crm/actions";

const ESTADOS = ["Nuevo", "Escalado", "Atendido", "Cerrado"] as const;

export default function EstadoSelect({ id, value }: { id: string; value: string }) {
  return (
    <form action={actualizarEstadoAction}>
      <input type="hidden" name="id" value={id} />
      <select
        name="estado"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-white/10 bg-brand-bg px-2 py-1 text-sm text-brand-text outline-none focus:border-brand-primary"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    </form>
  );
}

"use client";

import { actualizarPrioridadAction } from "@/app/crm/actions";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"] as const;

export default function PrioridadSelect({ id, value }: { id: string; value: string }) {
  return (
    <form action={actualizarPrioridadAction}>
      <input type="hidden" name="id" value={id} />
      <select
        name="prioridad"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-white/10 bg-brand-bg px-2 py-1 text-sm text-brand-text outline-none focus:border-brand-primary"
      >
        {PRIORIDADES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </form>
  );
}

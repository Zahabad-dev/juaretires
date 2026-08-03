"use client";

import { actualizarAsesorAction } from "@/app/crm/actions";

export default function AsesorInput({ id, value }: { id: string; value: string }) {
  return (
    <form action={actualizarAsesorAction}>
      <input type="hidden" name="id" value={id} />
      <input
        type="text"
        name="asesor"
        defaultValue={value}
        placeholder="Sin asignar"
        onBlur={(e) => e.currentTarget.form?.requestSubmit()}
        className="w-28 rounded-lg border border-white/10 bg-brand-bg px-2 py-1 text-sm text-brand-text outline-none placeholder:text-brand-text/30 focus:border-brand-primary"
      />
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { sincronizarKordataAction } from "@/app/crm/actions";

export default function SincronizarKordataButton({
  totalCache,
  ultimaSync,
}: {
  totalCache: number;
  ultimaSync: string | null;
}) {
  const [state, action, pending] = useActionState(sincronizarKordataAction, undefined);

  return (
    <form action={action} className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-brand-primary/40 bg-brand-surface2 p-4">
      <div className="flex-1">
        <p className="font-heading text-sm text-brand-primary">Catálogo Kordata (para cotizaciones)</p>
        <p className="mt-1 text-xs text-brand-text/50">
          {totalCache} productos guardados localmente
          {ultimaSync ? ` · última sincronización: ${ultimaSync}` : ""}
        </p>
        {state?.error && <p className="mt-1 text-xs text-red-400">{state.error}</p>}
        {state?.success && <p className="mt-1 text-xs text-green-400">{state.success}</p>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Sincronizando…" : "Sincronizar precios"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { sincronizarNombresAsesoresAction } from "@/app/crm/actions";

export default function SincronizarNombresButton() {
  const [state, action, pending] = useActionState(sincronizarNombresAsesoresAction, undefined);

  return (
    <form action={action} className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full border border-brand-primary/40 px-4 py-1.5 font-heading text-sm text-brand-primary transition-colors hover:bg-brand-primary/10 disabled:opacity-50"
      >
        {pending ? "Sincronizando…" : "🔄 Sincronizar nombres en leads existentes"}
      </button>
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
      {state?.success && <p className="text-xs text-green-400">{state.success}</p>}
    </form>
  );
}

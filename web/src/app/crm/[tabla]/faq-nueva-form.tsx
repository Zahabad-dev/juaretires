"use client";

import { useActionState, useEffect, useRef } from "react";
import { crearFaqAction } from "@/app/crm/actions";

export default function FaqNuevaForm() {
  const [state, action, pending] = useActionState(crearFaqAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-dashed border-brand-primary/40 bg-brand-surface2 p-5"
    >
      <p className="mb-3 font-heading text-sm text-brand-primary">Agregar FAQ nueva</p>
      <div className="flex flex-col gap-3">
        <input
          name="pregunta"
          className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          placeholder="Pregunta"
        />
        <textarea
          name="respuesta"
          rows={3}
          className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          placeholder="Respuesta"
        />
        <div className="flex items-center justify-end gap-3">
          {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
          {state?.success && <p className="text-xs text-green-400">{state.success}</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Agregando…" : "Agregar"}
          </button>
        </div>
      </div>
    </form>
  );
}

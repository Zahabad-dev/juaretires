"use client";

import { useActionState } from "react";
import { actualizarFaqAction } from "@/app/crm/actions";

export default function FaqRowForm({
  id,
  pregunta,
  respuesta,
  activo,
}: {
  id: string;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}) {
  const [state, action, pending] = useActionState(actualizarFaqAction, undefined);

  return (
    <form
      action={action}
      className="rounded-2xl border border-white/10 bg-brand-surface2 p-5"
    >
      <input type="hidden" name="id" value={id} />

      <div className="flex flex-col gap-3">
        <input
          name="pregunta"
          defaultValue={pregunta}
          className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          placeholder="Pregunta"
        />
        <textarea
          name="respuesta"
          defaultValue={respuesta}
          rows={3}
          className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          placeholder="Respuesta"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-brand-text/70">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={activo}
              className="h-4 w-4 accent-brand-primary"
            />
            Activa
          </label>
          <div className="flex items-center gap-3">
            {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
            {state?.success && <p className="text-xs text-green-400">{state.success}</p>}
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

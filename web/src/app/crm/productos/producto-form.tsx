"use client";

import Image from "next/image";
import { useActionState } from "react";
import { actualizarProductoAction } from "@/app/crm/actions";

export default function ProductoForm({
  id,
  nombre,
  medida,
  descripcion,
  imagen,
  activo,
}: {
  id: string;
  nombre: string;
  medida: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
}) {
  const [state, action, pending] = useActionState(actualizarProductoAction, undefined);

  return (
    <form
      action={action}
      className="flex gap-4 rounded-2xl border border-white/10 bg-brand-surface2 p-4"
    >
      <input type="hidden" name="id" value={id} />
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white/5">
        <Image src={imagen} alt={nombre} fill className="object-contain p-1" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <input
            name="nombre"
            defaultValue={nombre}
            className="flex-1 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
            placeholder="Nombre del producto"
          />
          <input
            name="medida"
            defaultValue={medida}
            className="w-32 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
            placeholder="Medida"
          />
        </div>
        <textarea
          name="descripcion"
          defaultValue={descripcion}
          rows={2}
          className="rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          placeholder="Descripción"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-brand-text/70">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={activo}
              className="h-4 w-4 accent-brand-primary"
            />
            Visible en la página
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

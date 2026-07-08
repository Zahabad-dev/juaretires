"use client";

import { eliminarSolicitudAction } from "@/app/crm/actions";

export default function EliminarButton({ id }: { id: string }) {
  return (
    <form
      action={eliminarSolicitudAction}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-500/40 px-2 py-1 text-sm text-red-400 transition-colors hover:bg-red-500/10"
      >
        Eliminar
      </button>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { cambiarPasswordUsuarioAction } from "@/app/crm/actions";

export default function PasswordForm({
  id,
  username,
  nombre,
  rol,
  activo,
}: {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
}) {
  const [state, action, pending] = useActionState(cambiarPasswordUsuarioAction, undefined);
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-brand-surface2 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-heading text-sm text-brand-text">
            {nombre} <span className="text-brand-text/40">· {username}</span>
          </p>
          <p className="text-xs text-brand-text/50">
            {rol}
            {!activo && <span className="text-red-400"> · inactivo</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 font-heading text-xs text-brand-text/80 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          {abierto ? "Cancelar" : "Cambiar contraseña"}
        </button>
      </div>

      {abierto && (
        <form action={action} className="mt-3 flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input
            type="text"
            name="password"
            placeholder="Nueva contraseña (mín. 8 caracteres)"
            autoComplete="off"
            className="flex-1 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-brand-primary px-4 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
        </form>
      )}
      {state?.error && <p className="mt-2 text-xs text-red-400">{state.error}</p>}
      {state?.success && <p className="mt-2 text-xs text-green-400">Contraseña actualizada.</p>}
    </div>
  );
}

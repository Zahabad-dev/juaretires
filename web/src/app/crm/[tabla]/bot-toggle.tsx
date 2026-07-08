"use client";

import { actualizarBotActivoAction } from "@/app/crm/actions";

export default function BotToggle({ id, activo }: { id: string; activo: boolean }) {
  return (
    <form action={actualizarBotActivoAction}>
      <input type="hidden" name="id" value={id} />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-text/80">
        <input
          type="checkbox"
          name="bot_activo"
          defaultChecked={activo}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="h-4 w-4 accent-brand-primary"
        />
        {activo ? "Bot activo" : "Desactivado"}
      </label>
    </form>
  );
}

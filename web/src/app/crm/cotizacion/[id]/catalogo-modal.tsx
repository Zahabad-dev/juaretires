"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductoCatalogo } from "./producto-buscador";

const MAX_RESULTADOS = 30;

export default function CatalogoModal({
  abierto,
  onCerrar,
  catalogo,
  onAgregar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  catalogo: ProductoCatalogo[];
  onAgregar: (nombre: string, precio: number | null) => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [montado, setMontado] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (abierto) {
      setBusqueda("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    if (abierto) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [abierto, onCerrar]);

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (q.length === 0) return catalogo.slice(0, MAX_RESULTADOS);
    return catalogo
      .filter((p) => p.nombre.toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q))
      .slice(0, MAX_RESULTADOS);
  }, [busqueda, catalogo]);

  const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  if (!montado || !abierto) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-black/70 p-0 sm:items-center sm:justify-center sm:p-6">
      <div
        className="flex h-full w-full flex-col bg-brand-bg sm:h-auto sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl sm:border sm:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <input
            ref={inputRef}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o SKU…"
            className="flex-1 rounded-lg border border-white/10 bg-brand-surface2 px-3 py-2 text-base text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={onCerrar}
            className="shrink-0 rounded-full border border-white/20 px-3 py-2 text-sm text-brand-text/70 hover:border-brand-primary hover:text-brand-primary"
          >
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {resultados.length === 0 && (
            <p className="p-6 text-center text-sm text-brand-text/40">Sin resultados.</p>
          )}
          {resultados.map((p) => (
            <button
              type="button"
              key={`${p.sku}-${p.nombre}`}
              onClick={() => {
                onAgregar(p.nombre, p.precio);
                onCerrar();
              }}
              className="flex w-full flex-col gap-1 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm text-brand-text">{p.nombre}</span>
              <span className="shrink-0 font-heading text-sm text-brand-primary">
                {p.precio !== null ? fmt(p.precio) : "sin precio"}
              </span>
            </button>
          ))}
        </div>

        {catalogo.length > MAX_RESULTADOS && busqueda.trim() === "" && (
          <p className="border-t border-white/10 p-3 text-center text-xs text-brand-text/30">
            Mostrando los primeros {MAX_RESULTADOS} de {catalogo.length} — escribe para buscar más.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}

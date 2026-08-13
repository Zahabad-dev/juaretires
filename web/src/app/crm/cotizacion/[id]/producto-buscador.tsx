"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ProductoCatalogo {
  nombre: string;
  sku: string | null;
  precio: number | null;
}

const MAX_SUGERENCIAS = 8;

export default function ProductoBuscador({
  name,
  value,
  onChange,
  onSeleccionar,
  catalogo,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (valor: string) => void;
  onSeleccionar: (nombre: string, precio: number | null) => void;
  catalogo: ProductoCatalogo[];
  placeholder?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [montado, setMontado] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMontado(true), []);

  const fmt = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  const resultados = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];
    return catalogo
      .filter((p) => p.nombre.toLowerCase().includes(q) || (p.sku ?? "").toLowerCase().includes(q))
      .slice(0, MAX_SUGERENCIAS);
  }, [value, catalogo]);

  function calcularPosicion() {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }

  function abrir() {
    calcularPosicion();
    setAbierto(true);
  }

  useEffect(() => {
    if (!abierto) return;
    function onClickFuera(e: MouseEvent) {
      const t = e.target as Node;
      if (inputRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setAbierto(false);
    }
    function onScrollOrResize() {
      setAbierto(false);
    }
    document.addEventListener("mousedown", onClickFuera);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onClickFuera);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [abierto]);

  function elegir(p: ProductoCatalogo) {
    onSeleccionar(p.nombre, p.precio);
    setAbierto(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!abierto || resultados.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((a) => Math.min(a + 1, resultados.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      elegir(resultados[activo]);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  }

  const mostrarDropdown = abierto && resultados.length > 0 && pos;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActivo(0);
          abrir();
        }}
        onFocus={abrir}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-white/10 bg-brand-bg px-3 py-1.5 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
      />
      {montado &&
        mostrarDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="z-50 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-brand-surface2 shadow-2xl"
          >
            {resultados.map((p, i) => (
              <button
                type="button"
                key={`${p.sku}-${p.nombre}`}
                onClick={() => elegir(p)}
                onMouseEnter={() => setActivo(i)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${
                  i === activo ? "bg-brand-primary/15 text-brand-text" : "text-brand-text/80"
                }`}
              >
                <span className="truncate">{p.nombre}</span>
                <span className="shrink-0 font-heading text-xs text-brand-primary">
                  {p.precio !== null ? fmt(p.precio) : "sin precio"}
                </span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

"use client";

import { useActionState, useMemo, useState } from "react";
import { guardarCotizacionAction } from "@/app/crm/actions";
import ProductoBuscador, { type ProductoCatalogo } from "./producto-buscador";
import CatalogoModal from "./catalogo-modal";

interface Item {
  producto: string;
  cantidad: number;
  precio: string; // string para permitir vacío mientras el asesor captura
}

export default function CotizacionForm({
  solicitudId,
  itemsIniciales,
  catalogo,
}: {
  solicitudId: string;
  itemsIniciales: Item[];
  catalogo: ProductoCatalogo[];
}) {
  const [items, setItems] = useState<Item[]>(
    itemsIniciales.length > 0 ? itemsIniciales : [{ producto: "", cantidad: 1, precio: "" }]
  );
  const [state, action, pending] = useActionState(guardarCotizacionAction, undefined);
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);

  const totales = useMemo(() => {
    const subtotal = items.reduce((sum, it) => {
      const precio = parseFloat(it.precio);
      if (Number.isNaN(precio)) return sum;
      return sum + precio * it.cantidad;
    }, 0);
    const iva = subtotal * 0.16;
    return { subtotal, iva, total: subtotal + iva };
  }, [items]);

  function actualizar(i: number, campo: keyof Item, valor: string) {
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        if (campo === "cantidad") return { ...it, cantidad: Math.max(1, Number(valor) || 1) };
        return { ...it, [campo]: valor };
      })
    );
  }

  function seleccionarProducto(i: number, nombre: string, precio: number | null) {
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === i
          ? { ...it, producto: nombre, precio: precio !== null ? String(precio) : it.precio }
          : it
      )
    );
  }

  function agregarFila() {
    setItems((prev) => [...prev, { producto: "", cantidad: 1, precio: "" }]);
  }

  function agregarDesdeCatalogo(nombre: string, precio: number | null) {
    setItems((prev) => [
      ...prev,
      { producto: nombre, cantidad: 1, precio: precio !== null ? String(precio) : "" },
    ]);
  }

  function quitarFila(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const fmt = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="solicitud_id" value={solicitudId} />

      <p className="text-xs text-brand-text/40">
        Escribe para buscar en el catálogo de Kordata ({catalogo.length} productos), o teclea libre para
        un servicio (alineación, balanceo, etc.) — el precio se llena solo al elegir un producto de la lista.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-brand-surface2 text-brand-primary">
            <tr>
              <th className="px-4 py-3 font-heading">Producto</th>
              <th className="w-24 px-4 py-3 font-heading">Cant.</th>
              <th className="w-36 px-4 py-3 font-heading">P. Unitario</th>
              <th className="w-32 px-4 py-3 font-heading">Subtotal</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const precioNum = parseFloat(it.precio);
              const subtotalFila = Number.isNaN(precioNum) ? null : precioNum * it.cantidad;
              return (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-4 py-2">
                    <ProductoBuscador
                      name="producto"
                      value={it.producto}
                      onChange={(valor) => actualizar(i, "producto", valor)}
                      onSeleccionar={(nombre, precio) => seleccionarProducto(i, nombre, precio)}
                      catalogo={catalogo}
                      placeholder="Buscar producto o escribir un servicio"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="cantidad"
                      type="number"
                      min={1}
                      value={it.cantidad}
                      onChange={(e) => actualizar(i, "cantidad", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-brand-bg px-3 py-1.5 text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="precio"
                      type="number"
                      step="0.01"
                      min={0}
                      value={it.precio}
                      onChange={(e) => actualizar(i, "precio", e.target.value)}
                      placeholder="$—"
                      className="w-full rounded-lg border border-white/10 bg-brand-bg px-3 py-1.5 text-brand-text placeholder:text-brand-text/30 focus:border-brand-primary focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 text-brand-text/70">
                    {subtotalFila === null ? "—" : fmt(subtotalFila)}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => quitarFila(i)}
                      className="text-brand-text/40 hover:text-red-400"
                      aria-label="Quitar producto"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={agregarFila}
          className="w-fit rounded-full border border-white/20 px-4 py-1.5 font-heading text-sm text-brand-text/80 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          + Agregar producto
        </button>
        <button
          type="button"
          onClick={() => setCatalogoAbierto(true)}
          className="w-fit rounded-full border border-brand-primary/40 px-4 py-1.5 font-heading text-sm text-brand-primary transition-colors hover:bg-brand-primary/10"
        >
          🔍 Buscar en catálogo
        </button>
      </div>

      <CatalogoModal
        abierto={catalogoAbierto}
        onCerrar={() => setCatalogoAbierto(false)}
        catalogo={catalogo}
        onAgregar={agregarDesdeCatalogo}
      />

      <div className="ml-auto flex w-full max-w-xs flex-col gap-1.5 rounded-2xl border border-white/10 bg-brand-surface2 p-4 text-sm">
        <div className="flex justify-between text-brand-text/70">
          <span>Subtotal</span>
          <span>{fmt(totales.subtotal)}</span>
        </div>
        <div className="flex justify-between text-brand-text/70">
          <span>IVA (16%)</span>
          <span>{fmt(totales.iva)}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-1.5 font-heading text-brand-primary">
          <span>Total</span>
          <span>{fmt(totales.total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
        {state?.success && <p className="text-xs text-green-400">{state.success}</p>}
        <a
          href={`/api/crm/cotizacion/${solicitudId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/20 px-4 py-1.5 font-heading text-sm text-brand-text/80 transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          Ver / Imprimir
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-primary px-5 py-1.5 font-heading text-sm text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar cotización"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useMemo, useState } from "react";
import { guardarCotizacionAction } from "@/app/crm/actions";
import ProductoBuscador, { type ProductoCatalogo } from "./producto-buscador";
import CatalogoModal from "./catalogo-modal";

interface Item {
  producto: string;
  cantidad: number;
  precio: string; // string para permitir vacío mientras el asesor captura
  aplicaPromocion: boolean;
}

interface Promocion {
  id: number;
  nombre: string;
  porcentaje: number;
  categoria: string;
}

const CATEGORIA_LABEL: Record<string, string> = {
  promocion: "Promoción",
  institucion: "Institución",
  cupon: "Cupón",
};

export default function CotizacionForm({
  solicitudId,
  itemsIniciales,
  catalogo,
  sinIvaInicial,
  promociones,
  promocionIdInicial,
}: {
  solicitudId: string;
  itemsIniciales: Item[];
  catalogo: ProductoCatalogo[];
  sinIvaInicial: boolean;
  promociones: Promocion[];
  promocionIdInicial: number | null;
}) {
  const [items, setItems] = useState<Item[]>(
    itemsIniciales.length > 0
      ? itemsIniciales
      : [{ producto: "", cantidad: 1, precio: "", aplicaPromocion: true }]
  );
  const [state, action, pending] = useActionState(guardarCotizacionAction, undefined);
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);
  const [sinIva, setSinIva] = useState(sinIvaInicial);
  const [promocionId, setPromocionId] = useState<string>(
    promocionIdInicial !== null ? String(promocionIdInicial) : ""
  );

  const promocionActiva = promociones.find((p) => String(p.id) === promocionId) || null;

  const totales = useMemo(() => {
    let subtotal = 0;
    let baseDescuento = 0;
    for (const it of items) {
      const precio = parseFloat(it.precio);
      if (Number.isNaN(precio)) continue;
      const importe = precio * it.cantidad;
      subtotal += importe;
      if (promocionActiva && it.aplicaPromocion) baseDescuento += importe;
    }
    const descuento = promocionActiva ? baseDescuento * (promocionActiva.porcentaje / 100) : 0;
    const subtotalConDescuento = subtotal - descuento;
    const iva = sinIva ? 0 : subtotalConDescuento * 0.16;
    return { subtotal, descuento, subtotalConDescuento, iva, total: subtotalConDescuento + iva };
  }, [items, sinIva, promocionActiva]);

  function actualizar(i: number, campo: "producto" | "cantidad" | "precio", valor: string) {
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        if (campo === "cantidad") return { ...it, cantidad: Math.max(1, Number(valor) || 1) };
        return { ...it, [campo]: valor };
      })
    );
  }

  function alternarAplicaPromocion(i: number) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, aplicaPromocion: !it.aplicaPromocion } : it))
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
    setItems((prev) => [...prev, { producto: "", cantidad: 1, precio: "", aplicaPromocion: true }]);
  }

  function agregarDesdeCatalogo(nombre: string, precio: number | null) {
    setItems((prev) => [
      ...prev,
      { producto: nombre, cantidad: 1, precio: precio !== null ? String(precio) : "", aplicaPromocion: true },
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

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-brand-surface2 p-4">
        <label className="text-xs text-brand-text/60">Promoción / institución / cupón</label>
        <select
          name="promocion_id"
          value={promocionId}
          onChange={(e) => setPromocionId(e.target.value)}
          className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-brand-bg px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
        >
          <option value="">Ninguna</option>
          {promociones.map((p) => (
            <option key={p.id} value={p.id}>
              {CATEGORIA_LABEL[p.categoria] ?? p.categoria} — {p.nombre} ({p.porcentaje}%)
            </option>
          ))}
        </select>
        {promocionActiva && (
          <p className="w-full text-xs text-brand-text/50">
            Solo una promoción activa a la vez — marca abajo a qué renglones aplica el {promocionActiva.porcentaje}%.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-brand-surface2 text-brand-primary">
            <tr>
              <th className="px-4 py-3 font-heading">Producto</th>
              <th className="w-24 px-4 py-3 font-heading">Cant.</th>
              <th className="w-36 px-4 py-3 font-heading">P. Unitario</th>
              <th className="w-32 px-4 py-3 font-heading">Subtotal</th>
              {promocionActiva && <th className="w-20 px-4 py-3 font-heading">Descuento</th>}
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
                  {promocionActiva && (
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={it.aplicaPromocion}
                        onChange={() => alternarAplicaPromocion(i)}
                        className="h-4 w-4 accent-brand-primary"
                        title="Aplica la promoción a este renglón"
                      />
                    </td>
                  )}
                  <td className="px-2 py-2">
                    <input type="hidden" name="aplica_promocion" value={it.aplicaPromocion ? "1" : "0"} />
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

      <div className="ml-auto flex w-full max-w-xs flex-col gap-2.5 rounded-2xl border border-white/10 bg-brand-surface2 p-4 text-sm">
        <label className="flex items-center gap-2 text-xs text-brand-text/60">
          <input
            type="checkbox"
            name="sin_iva"
            checked={sinIva}
            onChange={(e) => setSinIva(e.target.checked)}
            className="h-4 w-4 accent-brand-primary"
          />
          Cotización sin IVA
        </label>
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-2.5">
          <div className="flex justify-between text-brand-text/70">
            <span>Subtotal</span>
            <span>{fmt(totales.subtotal)}</span>
          </div>
          {promocionActiva && (
            <div className="flex justify-between text-brand-primary">
              <span>
                {CATEGORIA_LABEL[promocionActiva.categoria] ?? "Promoción"} ({promocionActiva.porcentaje}%)
              </span>
              <span>-{fmt(totales.descuento)}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-text/70">
            <span>IVA (16%)</span>
            <span>{sinIva ? "Exento" : fmt(totales.iva)}</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-1.5 font-heading text-brand-primary">
            <span>Total</span>
            <span>{fmt(totales.total)}</span>
          </div>
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

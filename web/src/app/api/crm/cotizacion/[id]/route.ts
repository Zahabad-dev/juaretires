import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await params;
  const result = await query(
    `SELECT id, telefono, nombre, canal, productos, notas, creado_en, sin_iva,
            promocion_nombre, promocion_porcentaje, numero_cotizacion
     FROM solicitudes WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return new NextResponse("Solicitud no encontrada", { status: 404 });
  }

  const s = result.rows[0] as {
    id: number;
    telefono: string;
    nombre: string | null;
    canal: string;
    productos: string | null;
    notas: string | null;
    creado_en: Date;
    sin_iva: boolean;
    promocion_nombre: string | null;
    promocion_porcentaje: string | null;
    numero_cotizacion: number | null;
  };

  const itemsResult = await query(
    `SELECT producto, cantidad, precio_unitario, aplica_promocion FROM solicitud_items WHERE solicitud_id = $1 ORDER BY orden, id`,
    [id]
  );
  const items = itemsResult.rows as {
    producto: string;
    cantidad: number;
    precio_unitario: string | null;
    aplica_promocion: boolean;
  }[];

  const fecha = new Date(s.creado_en).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const money = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  let subtotal = 0;
  let baseDescuento = 0;
  const promocionPorcentaje = s.promocion_porcentaje === null ? 0 : Number(s.promocion_porcentaje);
  const productosLineas = items.length > 0
    ? items.map((it) => {
        const precio = it.precio_unitario === null ? null : Number(it.precio_unitario);
        const lineaTotal = precio === null ? null : precio * it.cantidad;
        if (lineaTotal !== null) {
          subtotal += lineaTotal;
          if (s.promocion_nombre && it.aplica_promocion) baseDescuento += lineaTotal;
        }
        return `<tr>
      <td>${esc(it.producto)}</td>
      <td style="text-align:center">${it.cantidad}</td>
      <td style="text-align:right">${precio === null ? "$—" : money(precio)}</td>
      <td style="text-align:right">${lineaTotal === null ? "$—" : money(lineaTotal)}</td>
    </tr>`;
      }).join("\n")
    : (s.productos || "")
        .split("\n")
        .filter(Boolean)
        .map((p) => `<tr>
      <td>${esc(p)}</td>
      <td style="text-align:center">—</td>
      <td style="text-align:right">$—</td>
      <td style="text-align:right">$—</td>
    </tr>`)
        .join("\n");

  const descuento = s.promocion_nombre ? baseDescuento * (promocionPorcentaje / 100) : 0;
  const subtotalConDescuento = subtotal - descuento;
  const iva = s.sin_iva ? 0 : subtotalConDescuento * 0.16;
  const total = subtotalConDescuento + iva;
  const hayPreciosReales = items.some((it) => it.precio_unitario !== null);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotización JAURE #${s.id}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #dfe1e4;
      color: #1A1D22;
      padding: 0;
    }
    .page {
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      min-height: 100vh;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    }

    /* Header — banda oscura de marca */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      background: #0B0D11;
      background-image: linear-gradient(135deg, #0B0D11 0%, #1A1D22 100%);
      padding: 32px 44px;
      border-bottom: 3px solid #0033CC;
    }
    .logo-area { display: flex; align-items: center; gap: 14px; }
    .logo-area img { height: 40px; width: auto; display: block; }
    .logo-area .wordmark { line-height: 1.15; }
    .logo-area .wordmark .name {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #FFFFFF;
      text-transform: uppercase;
    }
    .logo-area .wordmark .tag {
      font-size: 10px;
      letter-spacing: 2px;
      color: #4D79FF;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .doc-info {
      text-align: right;
      font-size: 12.5px;
      color: #BFC3C8;
      line-height: 1.6;
    }
    .doc-info .num {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }

    .body-content { padding: 40px 44px 48px; }

    /* Client block */
    .client-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #F4F5F7;
      border: 1px solid #E4E6E9;
      border-radius: 10px;
      padding: 20px 22px;
      margin-bottom: 30px;
    }
    .client-block .label {
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #9B9FA6;
      margin-bottom: 3px;
    }
    .client-block .val {
      font-size: 14px;
      font-weight: 600;
      color: #1A1D22;
    }

    /* Table */
    h2 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0033CC;
      margin-bottom: 12px;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 28px;
    }
    thead {
      background: #0033CC;
      color: #fff;
    }
    thead th {
      padding: 11px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    tbody tr:nth-child(even) { background: #F7F8FA; }
    tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #ECEDEF;
    }

    /* Totals */
    .totals {
      margin-left: auto;
      width: 270px;
      margin-bottom: 40px;
    }
    .totals table { margin-bottom: 0; }
    .totals td { font-size: 13px; padding: 6px 12px; border: none; }
    .totals .total-row td {
      font-size: 17px;
      font-weight: 800;
      color: #0033CC;
      border-top: 2px solid #0033CC;
      padding-top: 12px;
    }

    /* Notes */
    .notes-block {
      background: #EEF2FF;
      border-left: 3px solid #0033CC;
      padding: 14px 18px;
      border-radius: 4px;
      font-size: 13px;
      color: #33363B;
      margin-bottom: 40px;
      white-space: pre-wrap;
    }

    /* Signature */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 56px;
    }
    .sig-box {
      border-top: 1.5px solid #C7CAD0;
      padding-top: 8px;
      font-size: 12px;
      color: #6B6F76;
      text-align: center;
    }

    /* Footer — banda oscura al calce */
    .footer {
      background: #0B0D11;
      text-align: center;
      font-size: 11px;
      color: #7B8290;
      padding: 16px;
      letter-spacing: 0.3px;
    }
    .footer strong { color: #BFC3C8; }

    @media print {
      body { background: #fff; }
      .page { box-shadow: none; min-height: auto; }
      .guardar-pdf-btn { display: none; }
      .signatures, .footer { page-break-inside: avoid; }
    }

    /* Botón flotante — solo en pantalla, nunca sale en el PDF/impresión */
    .guardar-pdf-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0033CC;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 14px 22px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,51,204,0.35);
    }
    .guardar-pdf-btn:hover { opacity: 0.92; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-area">
        <img src="/brand/jj-isotipo.png" alt="JAURE" />
        <div class="wordmark">
          <div class="name">JAURE</div>
          <div class="tag">Ingeniería Automotriz</div>
        </div>
      </div>
      <div class="doc-info">
        <div class="num">COTIZACIÓN #${s.numero_cotizacion !== null ? String(s.numero_cotizacion).padStart(4, "0") : "SIN FOLIO"}</div>
        <div>Fecha: ${fecha}</div>
        <div>Canal: ${esc(s.canal)}</div>
      </div>
    </div>

    <div class="body-content">
      <div class="client-block">
        <div>
          <div class="label">Cliente</div>
          <div class="val">${esc(s.nombre || "Sin nombre")}</div>
        </div>
        <div>
          <div class="label">Teléfono</div>
          <div class="val">${esc(s.telefono)}</div>
        </div>
      </div>

      <h2>Detalle de la cotización</h2>
      <table>
        <thead>
          <tr>
            <th>Descripción / Producto</th>
            <th style="text-align:center">Cantidad</th>
            <th style="text-align:right">P. Unitario</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productosLineas || `<tr><td colspan="4" style="text-align:center;color:#999;padding:20px">Sin productos especificados</td></tr>`}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr><td>Subtotal:</td><td style="text-align:right">${hayPreciosReales ? money(subtotal) : "$—"}</td></tr>
          ${s.promocion_nombre ? `<tr style="color:#0033CC"><td>${esc(s.promocion_nombre)} (${promocionPorcentaje}%):</td><td style="text-align:right">-${money(descuento)}</td></tr>` : ""}
          <tr><td>IVA (16%):</td><td style="text-align:right">${s.sin_iva ? "Exento" : hayPreciosReales ? money(iva) : "$—"}</td></tr>
          <tr class="total-row"><td>TOTAL:</td><td style="text-align:right">${hayPreciosReales ? money(total) : "$—"}</td></tr>
        </table>
      </div>

      ${s.notas ? `<h2>Notas</h2><div class="notes-block">${esc(s.notas)}</div>` : ""}

      <div class="signatures">
        <div class="sig-box">
          <p>Firma del cliente</p>
          <br /><br />
          <p>${esc(s.nombre || "___________________________")}</p>
        </div>
        <div class="sig-box">
          <p>Autorizado por</p>
          <br /><br />
          <p>JAURE Ingeniería Automotriz</p>
        </div>
      </div>
    </div>

    <div class="footer">
      Esta cotización es válida por 24 horas a partir de la fecha de emisión. · <strong>JAURE Ingeniería Automotriz</strong>
      <br />
      Dudas o para confirmar tu pedido — llamada o WhatsApp: <strong>775 111 0944</strong> · <strong>775 162 7027</strong>
    </div>
  </div>

  <button type="button" class="guardar-pdf-btn" onclick="window.print()">
    💾 Guardar PDF para enviar al cliente
  </button>

  <script>
    window.onload = () => window.print();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

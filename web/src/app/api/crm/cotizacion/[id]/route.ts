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
    `SELECT id, telefono, nombre, canal, productos, notas, creado_en
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
  };

  const fecha = new Date(s.creado_en).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const productosLineas = (s.productos || "")
    .split("\n")
    .filter(Boolean)
    .map((p) => `<tr>
      <td>${esc(p)}</td>
      <td style="text-align:center">—</td>
      <td style="text-align:right">$—</td>
      <td style="text-align:right">$—</td>
    </tr>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cotización Juare Tires #${s.id}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f4f4f4;
      color: #1a1a1a;
      padding: 0;
    }
    .page {
      background: #fff;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 52px 60px;
      min-height: 100vh;
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #e63946;
      padding-bottom: 20px;
      margin-bottom: 28px;
    }
    .logo-area h1 {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #e63946;
      text-transform: uppercase;
    }
    .logo-area p {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }
    .doc-info {
      text-align: right;
      font-size: 13px;
      color: #444;
    }
    .doc-info .num {
      font-size: 22px;
      font-weight: 700;
      color: #e63946;
    }

    /* Client block */
    .client-block {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .client-block .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #999;
      margin-bottom: 3px;
    }
    .client-block .val {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    /* Table */
    h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #e63946;
      margin-bottom: 12px;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 32px;
    }
    thead {
      background: #e63946;
      color: #fff;
    }
    thead th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th:not(:first-child) { text-align: center; }
    thead th:last-child { text-align: right; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
    }

    /* Totals */
    .totals {
      margin-left: auto;
      width: 260px;
      margin-bottom: 40px;
    }
    .totals table { margin-bottom: 0; }
    .totals td { font-size: 13px; padding: 6px 12px; border: none; }
    .totals .total-row td {
      font-size: 16px;
      font-weight: 700;
      color: #e63946;
      border-top: 2px solid #e63946;
      padding-top: 10px;
    }

    /* Notes */
    .notes-block {
      background: #fff8f8;
      border-left: 3px solid #e63946;
      padding: 14px 18px;
      border-radius: 4px;
      font-size: 13px;
      color: #444;
      margin-bottom: 40px;
      white-space: pre-wrap;
    }

    /* Signature */
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
    }
    .sig-box {
      border-top: 1.5px solid #aaa;
      padding-top: 8px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    /* Footer */
    .footer {
      margin-top: 48px;
      text-align: center;
      font-size: 11px;
      color: #bbb;
      border-top: 1px solid #eee;
      padding-top: 14px;
    }

    @media print {
      body { background: #fff; }
      .page { padding: 24px 32px 40px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-area">
        <h1>Juare Tires</h1>
        <p>Llantas, Servicio y Alineación</p>
      </div>
      <div class="doc-info">
        <div class="num">COTIZACIÓN #${String(s.id).padStart(4, "0")}</div>
        <div>Fecha: ${fecha}</div>
        <div>Canal: ${esc(s.canal)}</div>
      </div>
    </div>

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
        <tr><td>Subtotal:</td><td style="text-align:right">$—</td></tr>
        <tr><td>IVA (16%):</td><td style="text-align:right">$—</td></tr>
        <tr class="total-row"><td>TOTAL:</td><td style="text-align:right">$—</td></tr>
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
        <p>Juare Tires</p>
      </div>
    </div>

    <div class="footer">
      Esta cotización es válida por 7 días a partir de la fecha de emisión. · Juare Tires
    </div>
  </div>

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

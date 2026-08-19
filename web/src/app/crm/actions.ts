"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { query } from "@/lib/db";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"] as const;
const ESTADOS = ["Nuevo", "Escalado", "Atendido", "Cerrado"] as const;

// admin = Uriel (dueño JAURE); agencia = Black Sheep (Erik) -- ambos tienen acceso total al panel.
function esAdmin(rol: string | undefined) {
  return rol === "admin" || rol === "agencia";
}

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/crm",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Usuario o contraseña incorrectos.";
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/crm/login" });
}

export async function actualizarEstadoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const estado = String(formData.get("estado") || "");

  if (!id || !ESTADOS.includes(estado as typeof ESTADOS[number])) return;

  await query(
    `UPDATE solicitudes SET estado = $1, actualizado = NOW() WHERE id = $2`,
    [estado, id]
  );

  revalidatePath("/crm/solicitudes");
}

export async function actualizarPrioridadAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const prioridad = String(formData.get("prioridad") || "");

  if (!id || !PRIORIDADES.includes(prioridad as typeof PRIORIDADES[number])) return;

  await query(
    `UPDATE solicitudes SET prioridad = $1, actualizado = NOW() WHERE id = $2`,
    [prioridad, id]
  );

  revalidatePath("/crm/solicitudes");
}

export async function actualizarBotActivoAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const botActivo = formData.get("bot_activo") === "on";

  if (!id) return;

  await query(
    `UPDATE solicitudes SET bot_bloqueado = $1, actualizado = NOW() WHERE id = $2`,
    [!botActivo, id]
  );

  revalidatePath("/crm/solicitudes");
}

export async function actualizarAsesorAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const asesor = String(formData.get("asesor") || "").trim();

  if (!id) return;

  await query(
    `UPDATE solicitudes SET asesor = NULLIF($1, ''), actualizado = NOW() WHERE id = $2`,
    [asesor, id]
  );

  revalidatePath("/crm/solicitudes");
}

export async function eliminarSolicitudAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await query(`DELETE FROM solicitudes WHERE id = $1`, [id]);
  revalidatePath("/crm/solicitudes");
}

export async function actualizarFaqAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "Solo Uriel puede editar la FAQ." };
  }

  const id = String(formData.get("id") || "");
  const pregunta = String(formData.get("pregunta") || "").trim();
  const respuesta = String(formData.get("respuesta") || "").trim();
  const activo = formData.get("activo") === "on";

  if (!id || !pregunta || !respuesta) {
    return { error: "Pregunta y respuesta no pueden estar vacías." };
  }

  await query(
    `UPDATE faq SET pregunta = $1, respuesta = $2, activo = $3 WHERE id = $4`,
    [pregunta, respuesta, activo, id]
  );

  revalidatePath("/crm/faq");
  return { success: "FAQ actualizada." };
}

export async function crearFaqAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "Solo Uriel puede agregar FAQ." };
  }

  const pregunta = String(formData.get("pregunta") || "").trim();
  const respuesta = String(formData.get("respuesta") || "").trim();

  if (!pregunta || !respuesta) {
    return { error: "Pregunta y respuesta no pueden estar vacías." };
  }

  await query(
    `INSERT INTO faq (pregunta, respuesta, activo) VALUES ($1, $2, true)`,
    [pregunta, respuesta]
  );

  revalidatePath("/crm/faq");
  return { success: "FAQ agregada." };
}

export async function guardarCotizacionAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const solicitudId = String(formData.get("solicitud_id") || "");
  if (!solicitudId) {
    return { error: "Falta el id de la solicitud." };
  }

  const productos = formData.getAll("producto").map((v) => String(v).trim());
  const cantidades = formData.getAll("cantidad").map((v) => Number(v) || 1);
  const precios = formData.getAll("precio").map((v) => {
    const s = String(v).trim();
    return s === "" ? null : Number(s);
  });
  const aplicaPromocionFlags = formData.getAll("aplica_promocion").map((v) => String(v) === "1");
  const sinIva = formData.get("sin_iva") === "on";
  const cotizacionEnviada = formData.get("cotizacion_enviada") === "on";

  const filas = productos
    .map((producto, i) => ({
      producto,
      cantidad: cantidades[i] ?? 1,
      precio: precios[i] ?? null,
      aplicaPromocion: aplicaPromocionFlags[i] ?? true,
    }))
    .filter((f) => f.producto !== "");

  // "Generada" se marca sola la primera vez que hay al menos un producto con
  // precio real -- a partir de ahí corre el reloj del recordatorio al asesor
  // si no la marca como enviada. Nunca se vuelve a poner en null después.
  const hayPrecioReal = filas.some((f) => f.precio !== null);

  // Una sola promoción por cotización -- no hay descuento sobre descuento.
  // Se guarda nombre/porcentaje como "foto" al momento de aplicarla, no una
  // referencia viva al catálogo, para no alterar cotizaciones ya guardadas.
  const promocionIdRaw = String(formData.get("promocion_id") || "");
  let promocionId: number | null = null;
  let promocionNombre: string | null = null;
  let promocionPorcentaje: number | null = null;
  if (promocionIdRaw) {
    const promoRes = await query<{ id: number; nombre: string; porcentaje: string }>(
      `SELECT id, nombre, porcentaje FROM promociones WHERE id = $1 AND activo = true`,
      [promocionIdRaw]
    );
    const promo = promoRes.rows[0];
    if (promo) {
      promocionId = promo.id;
      promocionNombre = promo.nombre;
      promocionPorcentaje = Number(promo.porcentaje);
    }
  }

  // Folio de cotización: independiente del id de la solicitud (que es una
  // fila por CLIENTE, no por cotización). Se asigna uno NUEVO solo si
  // todavía no tiene folio, o si la cotización que ya estaba guardada se
  // había marcado como enviada -- eso significa que esto es una cotización
  // DISTINTA para el mismo cliente (ej. pide otra al día siguiente) y no
  // debe compartir folio con la anterior. Si sigue siendo el mismo borrador
  // sin enviar, se conserva el folio.
  let numeroCotizacion: number | null = null;
  let folioNuevo = false;
  if (hayPrecioReal) {
    const actual = await query<{ numero_cotizacion: number | null; cotizacion_enviada: boolean }>(
      `SELECT numero_cotizacion, cotizacion_enviada FROM solicitudes WHERE id = $1`,
      [solicitudId]
    );
    const previo = actual.rows[0];
    folioNuevo = !previo || previo.numero_cotizacion === null || previo.cotizacion_enviada === true;
    if (folioNuevo) {
      const contador = await query<{ ultimo_numero: number }>(
        `UPDATE cotizacion_contador SET ultimo_numero = ultimo_numero + 1 WHERE id = 1 RETURNING ultimo_numero`
      );
      numeroCotizacion = contador.rows[0].ultimo_numero;
    } else {
      numeroCotizacion = previo!.numero_cotizacion;
    }
  }

  await query(
    `UPDATE solicitudes SET
       sin_iva = $1,
       promocion_id = $2,
       promocion_nombre = $3,
       promocion_porcentaje = $4,
       cotizacion_enviada = $5,
       cotizacion_enviada_en = CASE WHEN $5 AND cotizacion_enviada_en IS NULL THEN NOW() ELSE cotizacion_enviada_en END,
       numero_cotizacion = CASE WHEN $6 THEN $8 ELSE numero_cotizacion END,
       cotizacion_generada_en = CASE
         WHEN NOT $6 THEN cotizacion_generada_en
         WHEN $9 THEN NOW()
         ELSE COALESCE(cotizacion_generada_en, NOW())
       END,
       cotizacion_recordatorio_en = CASE WHEN $6 AND $9 THEN NULL ELSE cotizacion_recordatorio_en END
     WHERE id = $7`,
    [sinIva, promocionId, promocionNombre, promocionPorcentaje, cotizacionEnviada, hayPrecioReal, solicitudId, numeroCotizacion, folioNuevo]
  );
  await query(`DELETE FROM solicitud_items WHERE solicitud_id = $1`, [solicitudId]);

  for (let i = 0; i < filas.length; i++) {
    const f = filas[i];
    await query(
      `INSERT INTO solicitud_items (solicitud_id, producto, cantidad, precio_unitario, orden, aplica_promocion) VALUES ($1, $2, $3, $4, $5, $6)`,
      [solicitudId, f.producto, f.cantidad, f.precio, i, f.aplicaPromocion]
    );
  }

  revalidatePath(`/crm/cotizacion/${solicitudId}`);
  return { success: "Cotización guardada." };
}

const KORDATA_API_KEY =
  "kd_live_kef_XooHBE14C2-5qVLTTgYTF-4c5LQt7MtFP5BjJORoDIwNKFF_xHP5xVmuaRRRTHGzU9vChDyWLkNpxIzhjw";

interface KordataProducto {
  id: number;
  sku: string | null;
  nombreProducto: string | null;
  precioVenta: number | null;
}

// Sincroniza el catalogo completo de Kordata a la copia local (kordata_productos_cache).
// Se llama manualmente (boton en /crm/productos), nunca automatico por interaccion del
// usuario -- asi no se abusa de la API de Kordata.
export async function sincronizarKordataAction(
  _prevState: { error?: string; success?: string } | undefined
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "Solo Uriel puede sincronizar precios." };
  }

  async function fetchPagina(page: number) {
    const res = await fetch("https://api.kordata.mx/productos/listado", {
      method: "POST",
      headers: {
        "x-api-key": KORDATA_API_KEY,
        "x-api-version": "v1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page, size: 100 }),
    });
    if (!res.ok) throw new Error(`Kordata respondió ${res.status} en la página ${page + 1}.`);
    const data = await res.json();
    return {
      content: (data?.data?.content ?? []) as KordataProducto[],
      totalPages: (data?.data?.totalPages ?? 1) as number,
    };
  }

  async function guardarPagina(content: KordataProducto[]) {
    const filas = content
      .map((p) => ({ id: p.id, sku: p.sku, nombre: p.nombreProducto || p.sku, precio: p.precioVenta }))
      .filter((f) => f.nombre);
    if (filas.length === 0) return 0;

    const values: unknown[] = [];
    const placeholders = filas
      .map((f, i) => {
        const b = i * 4;
        values.push(f.id, f.sku, f.nombre, f.precio);
        return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, NOW())`;
      })
      .join(",");

    await query(
      `INSERT INTO kordata_productos_cache (kordata_id, sku, nombre, precio_venta, actualizado_en)
       VALUES ${placeholders}
       ON CONFLICT (kordata_id) DO UPDATE SET
         sku = EXCLUDED.sku, nombre = EXCLUDED.nombre,
         precio_venta = EXCLUDED.precio_venta, actualizado_en = NOW()`,
      values
    );
    return filas.length;
  }

  let cargados = 0;
  const CONCURRENCIA = 4; // paginas en paralelo por tanda -- moderado, no satura Kordata

  try {
    const primera = await fetchPagina(0);
    cargados += await guardarPagina(primera.content);
    const totalPages = primera.totalPages;

    let page = 1;
    while (page < totalPages) {
      const tanda = [];
      for (let i = 0; i < CONCURRENCIA && page < totalPages; i++, page++) {
        tanda.push(fetchPagina(page));
      }
      const resultados = await Promise.all(tanda);
      for (const r of resultados) {
        cargados += await guardarPagina(r.content);
      }
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al conectar con Kordata." };
  }

  revalidatePath("/crm/productos");
  revalidatePath("/crm/cotizacion");
  return { success: `${cargados} productos sincronizados desde Kordata.` };
}

export async function actualizarAsesorNombreAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "Solo Uriel puede asignar nombres de asesores." };
  }

  const turno = String(formData.get("turno") || "").trim();
  const nombre = String(formData.get("nombre") || "").trim();
  const activo = formData.get("activo") === "on";

  if (!turno || !nombre) {
    return { error: "El nombre no puede estar vacío." };
  }

  await query(
    `UPDATE asesores SET nombre = $1, activo = $2, actualizado = NOW() WHERE turno = $3`,
    [nombre, activo, turno]
  );

  revalidatePath("/crm/asesores");
  return { success: "Asesor actualizado." };
}

// El nombre en solicitudes.asesor se guarda como "foto" al momento de asignar
// (no una referencia viva a asesores.nombre), asi que si luego se renombra a
// alguien, los leads ya asignados se quedan con el nombre viejo. Este boton
// resincroniza todos los leads existentes con el nombre actual de cada turno.
export async function sincronizarNombresAsesoresAction(
  _prevState: { error?: string; success?: string } | undefined
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "No tienes permiso para sincronizar nombres." };
  }

  const result = await query(
    `UPDATE solicitudes s SET asesor = a.nombre
     FROM asesores a
     WHERE a.turno = s.turno_asesor AND s.asesor IS DISTINCT FROM a.nombre`
  );

  revalidatePath("/crm/solicitudes");
  return { success: `${result.rowCount ?? 0} lead(s) actualizados con el nombre actual.` };
}

export async function actualizarProductoAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "Solo Uriel puede editar productos estrella." };
  }

  const id = String(formData.get("id") || "");
  const nombre = String(formData.get("nombre") || "").trim();
  const medida = String(formData.get("medida") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const activo = formData.get("activo") === "on";

  if (!id || !nombre || !descripcion) {
    return { error: "Nombre y descripción no pueden estar vacíos." };
  }

  await query(
    `UPDATE productos_estrella SET nombre = $1, medida = $2, descripcion = $3, activo = $4 WHERE id = $5`,
    [nombre, medida, descripcion, activo, id]
  );

  revalidatePath("/crm/productos");
  revalidatePath("/");
  return { success: "Producto actualizado." };
}

// Solo rol "agencia" (Black Sheep) puede resetear contraseñas -- pensado para prestar
// la cuenta "soporte" y poder quitarle el acceso cambiando la contraseña cuando se termine.
export async function cambiarPasswordUsuarioAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (session?.user?.rol !== "agencia") {
    return { error: "No tienes permiso para cambiar contraseñas." };
  }

  const id = String(formData.get("id") || "");
  const password = String(formData.get("password") || "");

  if (!id || password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const hash = await bcrypt.hash(password, 10);
  await query(`UPDATE crm_usuarios SET password_hash = $1 WHERE id = $2`, [hash, id]);

  revalidatePath("/crm/usuarios");
  return { success: "Contraseña actualizada." };
}

const CATEGORIAS_PROMOCION = ["promocion", "institucion", "cupon"] as const;

// Catálogo de promociones/instituciones/cupones -- solo admin/agencia lo administra.
// El vendedor solo elige UNA al cotizar (ver guardarCotizacionAction), nunca se combinan.
export async function guardarPromocionAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) {
    return { error: "No tienes permiso para editar promociones." };
  }

  const id = String(formData.get("id") || "");
  const nombre = String(formData.get("nombre") || "").trim();
  const porcentaje = Number(formData.get("porcentaje"));
  const categoria = String(formData.get("categoria") || "promocion");
  const activo = formData.get("activo") === "on";

  if (!nombre || !Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
    return { error: "Nombre válido y porcentaje entre 1 y 100." };
  }
  if (!CATEGORIAS_PROMOCION.includes(categoria as typeof CATEGORIAS_PROMOCION[number])) {
    return { error: "Categoría inválida." };
  }

  if (id) {
    await query(
      `UPDATE promociones SET nombre = $1, porcentaje = $2, categoria = $3, activo = $4 WHERE id = $5`,
      [nombre, porcentaje, categoria, activo, id]
    );
  } else {
    await query(
      `INSERT INTO promociones (nombre, porcentaje, categoria, activo) VALUES ($1, $2, $3, $4)`,
      [nombre, porcentaje, categoria, activo]
    );
  }

  revalidatePath("/crm/promociones");
  return { success: "Promoción guardada." };
}

export async function eliminarPromocionAction(formData: FormData) {
  const session = await auth();
  if (!esAdmin(session?.user?.rol)) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await query(`DELETE FROM promociones WHERE id = $1`, [id]);
  revalidatePath("/crm/promociones");
}

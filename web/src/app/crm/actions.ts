"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { query } from "@/lib/db";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"] as const;
const ESTADOS = ["Nuevo", "Escalado", "Atendido", "Cerrado"] as const;

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
  if (session?.user?.rol !== "admin") {
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

export async function actualizarAsesorNombreAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await auth();
  if (session?.user?.rol !== "admin") {
    return { error: "Solo Uriel puede asignar nombres de asesores." };
  }

  const turno = String(formData.get("turno") || "").trim();
  const nombre = String(formData.get("nombre") || "").trim();

  if (!turno || !nombre) {
    return { error: "El nombre no puede estar vacío." };
  }

  await query(
    `UPDATE asesores SET nombre = $1, actualizado = NOW() WHERE turno = $2`,
    [nombre, turno]
  );

  revalidatePath("/crm/asesores");
  return { success: "Asesor actualizado." };
}

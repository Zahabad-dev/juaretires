import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import PasswordForm from "./password-form";

export const dynamic = "force-dynamic";

interface UsuarioRow {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export default async function UsuariosPage() {
  const session = await auth();
  if (!session) redirect("/crm/login");
  if (session.user?.rol !== "agencia") redirect("/crm");

  const result = await query<UsuarioRow>(
    `SELECT id, username, nombre, rol, activo FROM crm_usuarios ORDER BY rol = 'agencia' DESC, id`
  );

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Link href="/crm" className="text-sm text-brand-text/50 hover:text-brand-primary">
            ← Volver
          </Link>
          <h1 className="mt-1 font-heading text-2xl text-brand-text">Usuarios</h1>
          <p className="text-sm text-brand-text/50">
            Cambia la contraseña de cualquier cuenta del CRM. Útil para prestar la cuenta
            &quot;soporte&quot; y quitarle el acceso cuando ya no se necesite.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {result.rows.map((r) => (
            <PasswordForm
              key={r.id}
              id={r.id}
              username={r.username}
              nombre={r.nombre}
              rol={r.rol}
              activo={r.activo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

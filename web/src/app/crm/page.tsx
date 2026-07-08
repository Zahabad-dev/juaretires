import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CRM_TABLES } from "@/lib/db";
import { logoutAction } from "@/app/crm/actions";

const DESCRIPTIONS: Record<string, string> = {
  solicitudes: "Cotizaciones solicitadas por clientes",
  contactos: "Leads y contactos registrados por el chatbot",
  conversaciones: "Historial de mensajes del chatbot",
  faq: "Preguntas frecuentes que usa el agente IA",
};

export default async function CrmHome() {
  const session = await auth();
  if (!session) redirect("/crm/login");

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-brand-text">
              CRM — Juare Tires
            </h1>
            <p className="text-sm text-brand-text/50">
              {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/20 px-4 py-1.5 font-heading text-sm text-brand-text/80 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              Cerrar sesión
            </button>
          </form>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {(Object.keys(CRM_TABLES) as Array<keyof typeof CRM_TABLES>).map((slug) => (
            <Link
              key={slug}
              href={`/crm/${slug}`}
              className="rounded-2xl border border-white/10 bg-brand-surface2 p-6 transition-colors hover:border-brand-primary"
            >
              <h2 className="font-heading text-lg text-brand-primary">
                {CRM_TABLES[slug].label}
              </h2>
              <p className="mt-1 text-sm text-brand-text/50">
                {DESCRIPTIONS[slug] ?? CRM_TABLES[slug].table}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

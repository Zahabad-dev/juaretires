import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CRM_TABLES } from "@/lib/db";

export default async function CrmHome() {
  const session = await auth();
  if (!session) redirect("/crm/login");

  return (
    <main className="min-h-screen bg-brand-bg p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-3xl text-brand-text">
          Panel — Juare Tires
        </h1>
        <p className="mt-1 text-sm text-brand-text/50">
          Bienvenido, {session.user?.name}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {(Object.keys(CRM_TABLES) as Array<keyof typeof CRM_TABLES>).map((slug) => (
            <Link
              key={slug}
              href={`/crm/${slug}`}
              className="rounded-2xl border border-white/10 bg-brand-surface2 p-6 transition-colors hover:border-brand-primary"
            >
              <h2 className="font-heading text-lg text-brand-primary">
                {CRM_TABLES[slug].label}
              </h2>
              <p className="mt-1 text-xs text-brand-text/50">
                {CRM_TABLES[slug].table}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

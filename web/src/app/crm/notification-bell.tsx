import Link from "next/link";
import { query } from "@/lib/db";

export default async function NotificationBell() {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM solicitudes WHERE notificado = false`
  );
  const count = Number(result.rows[0]?.count ?? 0);

  return (
    <Link
      href="/crm/solicitudes"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-brand-text/70 transition-colors hover:border-brand-primary hover:text-brand-primary"
      aria-label={count > 0 ? `${count} leads sin ver` : "Sin leads nuevos"}
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-semibold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

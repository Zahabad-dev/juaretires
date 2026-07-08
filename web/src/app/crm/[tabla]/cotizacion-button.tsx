"use client";

export default function CotizacionButton({ id }: { id: string }) {
  return (
    <a
      href={`/api/crm/cotizacion/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-brand-primary/40 px-2 py-1 text-sm text-brand-primary transition-colors hover:bg-brand-primary/10"
    >
      Cotización
    </a>
  );
}

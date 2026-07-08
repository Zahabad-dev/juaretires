import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-heading text-xl leading-none text-brand-text">
            Juare Tires
            <span className="block text-xs tracking-[0.3em] text-brand-accent">
              Llantas y Servicio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-heading text-sm text-brand-muted sm:flex">
          <a href="#servicios" className="transition-colors hover:text-brand-accent">Servicios</a>
          <a href="#galeria" className="transition-colors hover:text-brand-accent">Galería</a>
          <a href="#contacto" className="transition-colors hover:text-brand-accent">Contacto</a>
          <a
            href={whatsappLink("Hola, quiero cotizar llantas")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-primary px-5 py-2 text-brand-text transition-opacity hover:opacity-90"
          >
            Cotizar
          </a>
        </nav>
      </div>
    </header>
  );
}

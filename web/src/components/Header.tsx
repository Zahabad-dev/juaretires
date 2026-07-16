import Link from "next/link";
import Image from "next/image";
import { whatsappLink } from "@/lib/whatsapp";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/jj-isotipo.png"
            alt="JAURE"
            width={34}
            height={44}
            className="h-10 w-auto"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-semibold tracking-[0.22em] text-brand-text">
              JAURE
            </span>
            <span className="mt-1 text-[9px] font-medium tracking-[0.32em] text-brand-silver">
              INGENIERÍA AUTOMOTRIZ
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-heading text-xs font-semibold tracking-[0.18em] text-brand-silver sm:flex">
          <a href="#nosotros" className="transition-colors hover:text-brand-text">Nosotros</a>
          <a href="#servicios" className="transition-colors hover:text-brand-text">Servicios</a>
          <a href="#franquicias" className="transition-colors hover:text-brand-text">Franquicias</a>
          <a href="#contacto" className="transition-colors hover:text-brand-text">Contacto</a>
          <a
            href={whatsappLink("Hola, quiero una cotización")}
            target="_blank"
            rel="noopener noreferrer"
            className="angular bg-brand-primary px-6 py-2.5 text-white transition-opacity hover:opacity-85"
          >
            Cotizar
          </a>
        </nav>
      </div>
      {/* Línea principal — acento del sistema gráfico */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
    </header>
  );
}

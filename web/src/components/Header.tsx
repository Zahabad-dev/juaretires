import Link from "next/link";
// import Image from "next/image"; // descomentar cuando haya logo

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* BRAND — reemplazar con logo real
          <Image src="/brand/logo.png" alt="Juare Tires" width={44} height={44} className="h-11 w-auto object-contain" priority />
          */}
          <span className="font-heading text-xl leading-none text-brand-text">
            Juare Tires
            <span className="block text-xs tracking-[0.3em] text-brand-primary">
              Llantas y Servicio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-heading text-sm text-brand-text/80 sm:flex">
          <a href="#servicios" className="transition-colors hover:text-brand-primary">
            Servicios
          </a>
          <a href="#contacto" className="transition-colors hover:text-brand-primary">
            Contacto
          </a>
          {/* OPCIONAL — descomentar si tiene CRM */}
          {/* <Link href="/crm" className="rounded-full border border-brand-primary/60 px-4 py-1.5 text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-bg">
            Acceso clientes
          </Link> */}
        </nav>
      </div>
    </header>
  );
}

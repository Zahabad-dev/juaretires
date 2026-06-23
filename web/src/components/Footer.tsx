import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-white/10 bg-brand-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:justify-between">
        <div>
          <h3 className="font-heading text-lg text-brand-primary">
            Juare Tires
          </h3>
          <p className="mt-2 max-w-sm text-sm text-brand-text/70">
            Llantas nuevas y seminuevas, alineación, balanceo y servicio automotriz en Juárez.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-brand-text/70">
          <span className="font-heading text-brand-text">Contacto</span>
          <a
            href={whatsappLink("Hola, quiero información sobre sus servicios")}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-green"
          >
            WhatsApp
          </a>
          {/* <Link href="/crm" className="transition-colors hover:text-brand-primary">
            Acceso clientes
          </Link> */}
        </div>

        <div className="flex flex-col gap-2 text-sm text-brand-text/70">
          <span className="font-heading text-brand-text">Legal</span>
          <Link href="/politica-de-privacidad" className="transition-colors hover:text-brand-primary">
            Política de privacidad
          </Link>
          <Link href="/terminos-del-servicio" className="transition-colors hover:text-brand-primary">
            Términos del servicio
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-4 text-center text-xs text-brand-text/40">
        © {new Date().getFullYear()} Juare Tires. Todos los derechos reservados.
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import { whatsappLink } from "@/lib/whatsapp";

const SERVICIOS = [
  "Diagnóstico",
  "Mantenimiento",
  "Llantas",
  "Suspensión",
  "Frenos",
  "Alineación y Balanceo",
];

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-brand-border bg-brand-surface2 line-pattern">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-3">
        <div>
          <Image
            src="/brand/logo-jaure-full.png"
            alt="JAURE Ingeniería Automotriz"
            width={170}
            height={182}
            className="h-auto w-40"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-muted">
            Centro Automotriz Integral. Ingeniería, tecnología y experiencia
            para proteger tu movilidad.
          </p>
          <a
            href={whatsappLink("Hola, quiero información sobre sus servicios")}
            target="_blank"
            rel="noopener noreferrer"
            className="angular mt-6 inline-flex items-center gap-2 bg-brand-primary px-6 py-2.5 font-heading text-xs font-semibold tracking-[0.18em] text-white transition-opacity hover:opacity-85"
          >
            WhatsApp
          </a>
        </div>

        <div>
          <h4 className="font-heading text-xs font-semibold tracking-[0.3em] text-brand-text">
            Servicios
          </h4>
          <div className="brand-line mt-3" />
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-brand-muted">
            {SERVICIOS.map((s) => (
              <li key={s}>
                <a href="#servicios" className="transition-colors hover:text-brand-accent">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xs font-semibold tracking-[0.3em] text-brand-text">
            Legal
          </h4>
          <div className="brand-line mt-3" />
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-brand-muted">
            <li>
              <Link href="/politica-de-privacidad" className="transition-colors hover:text-brand-accent">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos-del-servicio" className="transition-colors hover:text-brand-accent">
                Términos del servicio
              </Link>
            </li>
          </ul>
          <h4 className="mt-9 font-heading text-xs font-semibold tracking-[0.3em] text-brand-text">
            Administración
          </h4>
          <div className="brand-line mt-3" />
          <Link
            href="/crm"
            className="mt-4 inline-block text-sm text-brand-muted transition-colors hover:text-brand-accent"
          >
            Panel CRM →
          </Link>
        </div>
      </div>

      <div className="border-t border-brand-border px-6 py-5 text-center text-xs tracking-[0.14em] text-brand-muted/60">
        © {new Date().getFullYear()} JAURE — INGENIERÍA AUTOMOTRIZ
      </div>
    </footer>
  );
}

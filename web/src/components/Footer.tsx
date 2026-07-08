import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-brand-border bg-brand-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg text-brand-text">Juare Tires</h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            Llantas nuevas y seminuevas, alineación, balanceo y servicio
            automotriz en Juárez.
          </p>
          <a
            href={whatsappLink("Hola, quiero información sobre sus servicios")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-green/30 px-4 py-2 text-sm text-brand-green transition-colors hover:bg-brand-green hover:text-white"
          >
            WhatsApp
          </a>
        </div>

        <div>
          <h4 className="font-heading text-sm text-brand-text">Servicios</h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-muted">
            {["Llantas Nuevas", "Llantas Seminuevas", "Alineación y Balanceo", "Servicio Express"].map((s) => (
              <li key={s}>
                <a href="#servicios" className="transition-colors hover:text-brand-accent">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm text-brand-text">Legal</h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-brand-muted">
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
          <h4 className="mt-8 font-heading text-sm text-brand-text">Administración</h4>
          <Link
            href="/crm"
            className="mt-2 inline-block text-sm text-brand-muted transition-colors hover:text-brand-accent"
          >
            Panel CRM →
          </Link>
        </div>
      </div>

      <div className="border-t border-brand-border px-6 py-4 text-center text-xs text-brand-muted/50">
        © {new Date().getFullYear()} Juare Tires — Black Sheep Agencia
      </div>
    </footer>
  );
}

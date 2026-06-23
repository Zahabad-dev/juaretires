import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { whatsappLink } from "@/lib/whatsapp";

const FEATURES = [
  {
    title: "Llantas Nuevas",
    text: "Amplio catálogo de las mejores marcas a precios competitivos.",
  },
  {
    title: "Seminuevas",
    text: "Llantas seminuevas inspeccionadas y garantizadas para tu bolsillo.",
  },
  {
    title: "Alineación y Balanceo",
    text: "Equipo de última generación para que tu vehículo ruede parejo.",
  },
  {
    title: "Servicio Express",
    text: "Montaje y reparación rápida. No necesitas cita, solo llega.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Escríbenos",
    text: "Mándanos un WhatsApp con la medida de tu llanta o tu vehículo.",
  },
  {
    n: "02",
    title: "Te Cotizamos",
    text: "Te enviamos opciones con precios y disponibilidad al momento.",
  },
  {
    n: "03",
    title: "Listo, Rueda",
    text: "Ven a la llantera, te montamos y alineamos en minutos.",
  },
];

export default function Home() {
  const heroWhatsapp = whatsappLink("Hola, quiero cotizar llantas");

  return (
    <div className="flex flex-1 flex-col bg-brand-bg">
      <Header />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10 px-6 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
            {/* <Image src="/brand/logo.png" alt="Juare Tires" width={160} height={160} className="h-28 w-auto object-contain" priority /> */}
            <h1 className="max-w-3xl text-4xl text-brand-text sm:text-6xl">
              Llantas y Servicio{" "}
              <span className="text-brand-primary">de Confianza</span>
            </h1>
            <p className="max-w-xl text-base text-brand-text/70 sm:text-lg">
              Nuevas, seminuevas, alineación y balanceo. Atención rápida y precios justos en Juárez.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={heroWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-primary px-8 py-3 font-heading text-brand-bg transition-transform hover:scale-105"
              >
                Cotizar por WhatsApp
              </a>
              <a
                href="#servicios"
                className="rounded-full border border-brand-text/30 px-8 py-3 font-heading text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </section>

        {/* Quiénes somos */}
        <section className="border-b border-white/10 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <h2 className="text-3xl text-brand-text sm:text-4xl">
                Tu Llantera de Confianza
              </h2>
              <p className="mt-4 text-brand-text/70">
                En Juare Tires nos especializamos en darte la mejor llanta para tu vehículo al mejor precio. Trabajamos con las marcas líderes y también ofrecemos opciones seminuevas garantizadas.
              </p>
              <p className="mt-4 text-brand-text/70">
                Nuestro equipo de técnicos certificados te atiende rápido y sin cita. Alineación, balanceo, reparación y montaje — todo en un solo lugar.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-brand-surface2 p-5"
                >
                  <h3 className="font-heading text-base text-brand-primary">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-text/70">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Servicios / Cómo funciona */}
        <section id="servicios" className="border-b border-white/10 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl text-brand-text sm:text-4xl">
              Así de Fácil
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="text-center sm:text-left">
                  <span className="font-heading text-4xl text-brand-primary">
                    {step.n}
                  </span>
                  <h3 className="mt-2 font-heading text-lg text-brand-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-text/70">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-brand-primary/30 bg-brand-surface2 px-8 py-16 text-center">
            <h2 className="text-3xl text-brand-text sm:text-4xl">
              ¿Necesitas Llantas?
            </h2>
            <p className="max-w-xl text-brand-text/70">
              Escríbenos la medida o el modelo de tu carro y te cotizamos al instante. Sin compromiso.
            </p>
            <a
              href={whatsappLink("Hola, necesito cotizar llantas para mi vehículo")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-green px-8 py-3 font-heading text-white transition-transform hover:scale-105"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

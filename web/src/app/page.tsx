import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { whatsappLink } from "@/lib/whatsapp";

const SERVICES = [
  {
    icon: "🛞",
    title: "Llantas Nuevas",
    text: "Amplio catálogo de las mejores marcas internacionales a precios competitivos. Encuentra la llanta exacta para tu vehículo.",
    foto: "Foto: llanta nueva en exhibición",
  },
  {
    icon: "✅",
    title: "Seminuevas",
    text: "Llantas seminuevas inspeccionadas y garantizadas. La opción inteligente para cuidar tu bolsillo sin sacrificar seguridad.",
    foto: "Foto: set de llantas seminuevas",
  },
  {
    icon: "⚙️",
    title: "Alineación y Balanceo",
    text: "Equipo de última generación para que tu vehículo ruede parejo, sin vibraciones y con máxima durabilidad en tus llantas.",
    foto: "Foto: máquina de alineación",
  },
  {
    icon: "⚡",
    title: "Servicio Express",
    text: "Montaje, desmontaje y reparación rápida. Sin cita previa. Entra y sal en minutos con tu vehículo listo para rodar.",
    foto: "Foto: servicio en el taller",
  },
];

const STATS = [
  { n: "10+", label: "Años de experiencia" },
  { n: "20+", label: "Marcas disponibles" },
  { n: "5K+", label: "Clientes atendidos" },
  { n: "100%", label: "Garantía de calidad" },
];

const STEPS = [
  {
    n: "01",
    title: "Escríbenos",
    text: "Mándanos un WhatsApp con la medida de tu llanta o el modelo de tu vehículo.",
  },
  {
    n: "02",
    title: "Te Cotizamos",
    text: "Te enviamos opciones con precios reales y disponibilidad inmediata.",
  },
  {
    n: "03",
    title: "Listo, Rueda",
    text: "Ven a la llantera, te montamos, alineamos y balanceamos en minutos.",
  },
];

const GALLERY = [
  "Foto: fachada del negocio",
  "Foto: área de servicio",
  "Foto: exhibición de llantas",
  "Foto: equipo de balanceo",
  "Foto: trabajo en proceso",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-bg">
      <Header />

      <main className="flex flex-1 flex-col">

        {/* ── HERO ── */}
        <section className="relative min-h-[90vh] overflow-hidden">
          {/* Foto de fondo */}
          <div className="photo-placeholder absolute inset-0 rounded-none border-0">
            <span className="text-2xl">📷</span>
            <span>Foto principal: taller o llantas — reemplazar con &lt;Image&gt;</span>
          </div>

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/60 via-transparent to-transparent" />

          {/* Contenido */}
          <div className="relative z-10 flex min-h-[90vh] items-center px-6">
            <div className="mx-auto w-full max-w-6xl">
              <p className="font-heading text-sm tracking-[0.4em] text-brand-accent">
                Juárez, México
              </p>
              <h1 className="mt-3 max-w-2xl text-5xl text-brand-text sm:text-7xl">
                Llantas y Servicio{" "}
                <span className="text-brand-accent">de Confianza</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-brand-muted sm:text-lg">
                Nuevas, seminuevas, alineación y balanceo. Atención rápida,
                precios justos y garantía real en cada servicio.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsappLink("Hola, quiero cotizar llantas para mi vehículo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-8 py-4 font-heading text-brand-text shadow-lg shadow-brand-primary/30 transition-all hover:scale-105 hover:bg-brand-accent"
                >
                  Cotizar por WhatsApp
                </a>
                <a
                  href="#servicios"
                  className="inline-flex items-center justify-center rounded-full border border-brand-accent/30 px-8 py-4 font-heading text-brand-text transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  Ver Servicios
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="border-y border-brand-border bg-brand-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-1 px-6 py-8 text-center">
                <span className="font-heading text-3xl text-brand-accent">{s.n}</span>
                <span className="text-xs text-brand-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUIÉNES SOMOS ── */}
        <section className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-16 sm:grid-cols-2">
            <div>
              <p className="font-heading text-xs tracking-[0.4em] text-brand-accent">
                Sobre Nosotros
              </p>
              <h2 className="mt-3 text-3xl text-brand-text sm:text-4xl">
                Tu Llantera de Confianza en Juárez
              </h2>
              <p className="mt-5 leading-relaxed text-brand-muted">
                En Juare Tires nos especializamos en darte la mejor llanta para
                tu vehículo al precio más justo. Trabajamos con las marcas
                líderes del mercado y también ofrecemos opciones seminuevas
                garantizadas para adaptarnos a tu presupuesto.
              </p>
              <p className="mt-4 leading-relaxed text-brand-muted">
                Nuestro equipo de técnicos certificados te atiende rápido y sin
                cita. Alineación, balanceo, reparación y montaje — todo en un
                solo lugar con equipo de última generación.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {["Garantía en cada servicio", "Atención sin cita previa", "Precios honestos y transparentes", "Técnicos certificados"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-brand-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Foto del taller */}
            <div className="photo-placeholder aspect-[4/3] w-full rounded-2xl">
              <span className="text-3xl">📷</span>
              <span>Foto: fachada o interior del taller</span>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section id="servicios" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-heading text-xs tracking-[0.4em] text-brand-accent">
                Lo que hacemos
              </p>
              <h2 className="mt-3 text-3xl text-brand-text sm:text-4xl">
                Nuestros Servicios
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface flex flex-col"
                >
                  {/* Foto del servicio */}
                  <div className="photo-placeholder aspect-video w-full">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="px-4 text-center">{s.foto}</span>
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <h3 className="font-heading text-sm text-brand-accent">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-muted">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALERÍA ── */}
        <section id="galeria" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-heading text-xs tracking-[0.4em] text-brand-accent">
                Galería
              </p>
              <h2 className="mt-3 text-3xl text-brand-text sm:text-4xl">
                Nuestro Trabajo
              </h2>
              <p className="mt-4 text-brand-muted">
                Calidad que se ve. Cada servicio realizado con cuidado y precisión.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {GALLERY.map((label, i) => (
                <div
                  key={i}
                  className={`photo-placeholder rounded-xl ${i === 0 ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1 lg:col-span-2 lg:row-span-2 aspect-square" : "aspect-square"}`}
                >
                  <span className="text-xl">📷</span>
                  <span className="px-2 text-center text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="font-heading text-xs tracking-[0.4em] text-brand-accent">
                El proceso
              </p>
              <h2 className="mt-3 text-3xl text-brand-text sm:text-4xl">
                Así de Fácil
              </h2>
            </div>

            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-full top-6 hidden h-px w-full -translate-x-1/2 bg-brand-primary/20 sm:block" />
                  )}
                  <span className="font-heading text-5xl text-brand-primary/30">{step.n}</span>
                  <h3 className="mt-3 font-heading text-lg text-brand-text">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden px-6 py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-brand-bg to-brand-surface2" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className="font-heading text-xs tracking-[0.4em] text-brand-accent">
              ¿Listo para rodar?
            </p>
            <h2 className="text-4xl text-brand-text sm:text-5xl">
              Cotiza tus Llantas Ahora
            </h2>
            <p className="max-w-md text-brand-muted">
              Escríbenos la medida o el modelo de tu carro y te respondemos al instante.
              Sin compromiso, sin esperar.
            </p>
            <a
              href={whatsappLink("Hola, necesito cotizar llantas para mi vehículo")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-3 rounded-full bg-brand-green px-10 py-4 font-heading text-white shadow-xl shadow-brand-green/20 transition-all hover:scale-105 hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.525 4.005 1.446 5.699L0 24l6.467-1.429A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.032-1.387l-.361-.214-3.735.825.84-3.639-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
              Escribir por WhatsApp
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

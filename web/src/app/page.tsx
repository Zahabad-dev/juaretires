import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { whatsappLink } from "@/lib/whatsapp";

/* Capacidades — Brandbook p.6 "Qué es JAURE" + servicios franquicia */
const SERVICES = [
  {
    title: "Diagnóstico",
    text: "Identificamos con precisión el origen de cada falla utilizando tecnología avanzada y metodologías de ingeniería.",
    foto: "/fotos/diagnostico.jpg",
  },
  {
    title: "Mantenimiento",
    text: "Servicios preventivos y correctivos bajo estándares OEM para garantizar máxima confiabilidad.",
    foto: "/fotos/mantenimiento.jpg",
  },
  {
    title: "Cambio de Aceite",
    text: "Cambio de aceite y filtros con productos certificados para prolongar la vida útil de tu motor.",
    foto: "/fotos/cambio-aceite.jpg",
  },
  {
    title: "Llantas",
    text: "Las mejores marcas y soluciones de llantas para cada tipo de vehículo y necesidad.",
    foto: "/fotos/llantas.jpg",
  },
  {
    title: "Suspensión",
    text: "Revisamos y optimizamos cada componente para asegurar estabilidad, confort y seguridad en cada camino.",
    foto: "/fotos/suspension.jpg",
  },
  {
    title: "Frenos",
    text: "Sistemas de frenado eficientes y confiables para tu seguridad y la de quienes te acompañan.",
    foto: "/fotos/frenos.jpg",
  },
  {
    title: "Alineación y Balanceo",
    text: "Precisión que se traduce en mayor vida útil de tus llantas, mejor manejo y menor consumo.",
    foto: "/fotos/alineacion.jpg",
  },
];

/* Valores — Brandbook p.2 */
const VALORES = [
  {
    title: "Confianza",
    text: "Generamos seguridad y tranquilidad en cada intervención.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Precisión",
    text: "Cada detalle importa. Diagnósticos exactos, soluciones efectivas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
      </svg>
    ),
  },
  {
    title: "Movimiento",
    text: "Impulsamos tu camino con desempeño, continuidad y eficiencia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <path d="M5 6l6 6-6 6M13 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    title: "Innovación",
    text: "Integramos tecnología y mejora constante en todo lo que hacemos.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
        <circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" />
        <path d="M8 18h8M18 8v8M7.5 16.5L16.5 7.5" />
      </svg>
    ),
  },
];

/* Marcas — Brandbook p.30 */
const MARCAS = [
  "Michelin", "Bridgestone", "Goodyear", "Pirelli", "Continental",
  "Dunlop", "Toyo Tires", "Nitto", "Kumho",
];

const STEPS = [
  {
    n: "01",
    title: "Escríbenos",
    text: "Mándanos un WhatsApp con la medida de tu llanta, el modelo de tu vehículo o el servicio que necesitas.",
  },
  {
    n: "02",
    title: "Te Cotizamos",
    text: "Te enviamos opciones con precios reales y disponibilidad inmediata, sin rodeos.",
  },
  {
    n: "03",
    title: "Listo, Rueda",
    text: "Ven al centro automotriz: diagnóstico, montaje, alineación y balanceo con precisión de ingeniería.",
  },
];

/* Franquicias — texto del cliente */
const FRANQUICIA_VENTAJAS = [
  {
    title: "Inventario Respaldo",
    text: "Con tu inversión inicial tendrás a tu disposición un inventario de llantas con valor de más de 50 millones de pesos.",
  },
  {
    title: "Modelo Llave en Mano",
    text: "Te entregamos un negocio listo para operar. Te acompañamos desde la selección del local hasta el día de la gran apertura.",
  },
  {
    title: "Demanda Constante",
    text: "Enfoque tanto en clientes particulares como en el lucrativo sector de flotillas empresariales.",
  },
];

const FRANQUICIA_NUMEROS = [
  { label: "Inversión inicial", value: "Desde $2.2 MDP" },
  { label: "Rentabilidad mensual (EBITDA)", value: "$120 – $150 mil" },
  { label: "Retorno de inversión", value: "≈ 18 meses" },
  { label: "Cobertura", value: "Todo México" },
];

const FRANQUICIA_INCLUYE = [
  "Licencia de la marca JAURE®",
  "Know-How operativo comprobado",
  "Manuales de procesos estandarizados",
  "Selección estratégica de ubicación",
  "Capacitación para ti y tu equipo",
  "Asistencia en marketing y publicidad",
  "Supervisión y acompañamiento constante",
];

const GALERIA = [
  { src: "/fotos/generica3.jpg", alt: "Instalaciones JAURE", wide: true },
  { src: "/fotos/generica2.jpg", alt: "Inventario de llantas JAURE" },
  { src: "/fotos/generica1.jpg", alt: "Servicio en taller JAURE" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-bg">
      <Header />

      <main className="flex flex-1 flex-col">

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] overflow-hidden">
          <Image
            src="/fotos/fachada.jpg"
            alt="Centro Automotriz JAURE"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/85 to-brand-bg/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/40" />

          <div className="relative z-10 flex min-h-[92vh] items-center px-6">
            <div className="mx-auto w-full max-w-6xl">
              <p className="kicker">Ingeniería Automotriz</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] text-brand-text sm:text-6xl">
                Precisión en{" "}
                <span className="text-brand-accent">cada detalle</span>
              </h1>
              <div className="brand-line mt-7" />
              <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-brand-silver sm:text-lg">
                Centro Automotriz Integral que combina ingeniería, tecnología y
                experiencia para optimizar el desempeño, la seguridad y la vida
                útil de tu vehículo.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsappLink("Hola, quiero cotizar un servicio para mi vehículo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="angular inline-flex items-center justify-center gap-2 bg-brand-primary px-9 py-4 font-heading text-sm font-semibold tracking-[0.16em] text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  Cotizar por WhatsApp
                </a>
                <a
                  href="#servicios"
                  className="angular inline-flex items-center justify-center border border-brand-silver/30 px-9 py-4 font-heading text-sm font-semibold tracking-[0.16em] text-brand-text transition-colors hover:border-brand-accent hover:text-brand-accent"
                >
                  Ver Servicios
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROMESA ── */}
        <div className="border-y border-brand-border bg-brand-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-3">
            {["Kilómetros", "Seguridad", "Confianza"].map((w, i) => (
              <div
                key={w}
                className={`flex items-baseline justify-center gap-2 px-6 py-7 ${i > 0 ? "border-t border-brand-border sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="font-heading text-xl font-bold tracking-[0.14em] text-brand-accent">MÁS</span>
                <span className="font-heading text-xl font-semibold tracking-[0.14em] text-brand-text">{w.toUpperCase()}.</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── NOSOTROS ── */}
        <section id="nosotros" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-16 sm:grid-cols-2">
            <div>
              <p className="kicker">Qué es JAURE</p>
              <h2 className="mt-4 text-3xl font-bold text-brand-text sm:text-4xl">
                Somos Ingeniería.<br />
                Confianza.{" "}
                <span className="text-brand-accent">Movimiento.</span>
              </h2>
              <div className="brand-line mt-6" />
              <p className="mt-7 font-light leading-relaxed text-brand-muted">
                JAURE es un Centro Automotriz Integral que combina ingeniería,
                tecnología y experiencia para ofrecer soluciones completas que
                optimizan el desempeño, la seguridad y la vida útil de tu
                vehículo.
              </p>
              <p className="mt-4 font-light leading-relaxed text-brand-muted">
                No solo resolvemos problemas.{" "}
                <span className="font-normal text-brand-accent">
                  Prevemos, optimizamos y protegemos.
                </span>
              </p>

              <div className="mt-10 grid grid-cols-2 gap-7">
                {VALORES.map((v) => (
                  <div key={v.title}>
                    <span className="text-brand-accent">{v.icon}</span>
                    <h3 className="mt-3 font-heading text-xs font-semibold tracking-[0.24em] text-brand-text">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-brand-muted">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/fotos/entrada.jpg"
                  alt="Recepción JAURE Ingeniería Automotriz"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Recurso angular */}
              <div className="angular absolute -bottom-4 -left-4 h-3 w-36 bg-brand-primary" />
            </div>
          </div>
        </section>

        {/* ── MANIFIESTO ── */}
        <section className="relative overflow-hidden border-b border-brand-border">
          <Image
            src="/fotos/generica1.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/75 to-brand-bg/45" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-28">
            <p className="kicker">Nuestro Manifiesto</p>
            <h2 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.15] text-brand-text sm:text-5xl">
              No solo vendemos llantas.{" "}
              <span className="text-brand-accent">Protegemos tu movilidad.</span>
            </h2>
            <div className="brand-line mt-7" />
            <ul className="mt-9 flex flex-col gap-4 text-sm font-light text-brand-silver sm:text-base">
              <li>Cada diagnóstico es una <span className="text-brand-accent">decisión.</span></li>
              <li>Cada reparación es una <span className="text-brand-accent">responsabilidad.</span></li>
              <li>Cada vehículo representa la <span className="text-brand-accent">confianza</span> de una persona.</li>
            </ul>
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section id="servicios" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="kicker">Nuestras Capacidades</p>
              <h2 className="mt-4 text-3xl font-bold text-brand-text sm:text-4xl">
                Servicios
              </h2>
              <div className="brand-line mx-auto mt-6" />
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="group flex flex-col overflow-hidden border border-brand-border bg-brand-surface transition-colors hover:border-brand-primary/50"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={s.foto}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col gap-2.5 p-5">
                    <h3 className="font-heading text-xs font-semibold tracking-[0.18em] text-brand-text">
                      {s.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-brand-muted">{s.text}</p>
                  </div>
                </div>
              ))}

              {/* Tile CTA — completa la retícula de 8 */}
              <a
                href={whatsappLink("Hola, necesito un servicio para mi vehículo")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start justify-between border border-brand-primary/40 bg-brand-surface2 p-6 transition-colors hover:border-brand-primary line-pattern"
              >
                <div>
                  <p className="kicker">¿Otro servicio?</p>
                  <h3 className="mt-3 font-heading text-lg font-semibold leading-snug tracking-[0.08em] text-brand-text">
                    Cuéntanos qué necesita tu vehículo
                  </h3>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-heading text-xs font-semibold tracking-[0.2em] text-brand-accent transition-transform group-hover:translate-x-1">
                  ESCRÍBENOS →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── MARCAS ── */}
        <div className="border-b border-brand-border bg-brand-surface2 line-pattern">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-center text-[10px] font-medium tracking-[0.4em] text-brand-muted">
              TRABAJAMOS CON LAS MEJORES MARCAS
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {MARCAS.map((m) => (
                <span
                  key={m}
                  className="font-heading text-sm font-semibold tracking-[0.22em] text-brand-silver/70 transition-colors hover:text-brand-silver"
                >
                  {m.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── FRANQUICIAS ── */}
        <section id="franquicias" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <p className="kicker">Franquicias</p>
                <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-brand-text sm:text-4xl">
                  Únete a la{" "}
                  <span className="text-brand-accent">Familia JAURE</span>
                </h2>
                <div className="brand-line mt-6" />
                <p className="mt-7 font-light leading-relaxed text-brand-muted">
                  Convierte tu inversión en un motor de éxito. Desde el año
                  2000 nos hemos consolidado como líderes en el servicio
                  integral de llantas, mantenimiento preventivo y atención
                  automotriz rápida. Hoy te ofrecemos replicar nuestro éxito
                  con un modelo de negocio estandarizado, altamente rentable y
                  diseñado para dominar el creciente mercado automotriz en
                  México.
                </p>

                <div className="mt-10 flex flex-col gap-6">
                  {FRANQUICIA_VENTAJAS.map((v, i) => (
                    <div key={v.title} className="flex gap-5">
                      <span className="font-heading text-2xl font-bold text-brand-primary/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-xs font-semibold tracking-[0.22em] text-brand-text">
                          {v.title.toUpperCase()}
                        </h3>
                        <p className="mt-2 text-sm font-light leading-relaxed text-brand-muted">{v.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 border border-brand-border bg-brand-surface p-7">
                  <h3 className="font-heading text-xs font-semibold tracking-[0.26em] text-brand-text">
                    TU FRANQUICIA INCLUYE
                  </h3>
                  <ul className="mt-5 grid gap-2.5 text-sm font-light text-brand-muted sm:grid-cols-2">
                    {FRANQUICIA_INCLUYE.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/fotos/fachada2.jpg"
                    alt="Sucursal JAURE"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="angular absolute -bottom-0 left-0 h-2.5 w-32 bg-brand-primary" />
                </div>

                <div className="grid grid-cols-2 gap-px border border-brand-border bg-brand-border">
                  {FRANQUICIA_NUMEROS.map((n) => (
                    <div key={n.label} className="flex flex-col gap-1.5 bg-brand-surface p-5">
                      <span className="font-heading text-lg font-bold tracking-wide text-brand-accent">
                        {n.value}
                      </span>
                      <span className="text-[11px] leading-snug text-brand-muted">{n.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-light leading-relaxed text-brand-muted">
                  Alto potencial en Hidalgo, Querétaro, Puebla, Tlaxcala,
                  Estado de México y CDMX. Modelo de entrega llave en mano.
                </p>

                <a
                  href={whatsappLink("Hola, quiero información sobre las franquicias JAURE")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="angular inline-flex items-center justify-center gap-2 bg-brand-primary px-8 py-4 font-heading text-sm font-semibold tracking-[0.16em] text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  Solicitar Información
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTALACIONES ── */}
        <section id="instalaciones" className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="kicker">Instalaciones</p>
              <h2 className="mt-4 text-3xl font-bold text-brand-text sm:text-4xl">
                Tecnología de Vanguardia
              </h2>
              <div className="brand-line mx-auto mt-6" />
              <p className="mx-auto mt-6 max-w-xl font-light text-brand-muted">
                Instalaciones modernas, equipadas con tecnología de vanguardia y
                espacios diseñados para ofrecer el mejor servicio, seguridad y
                comodidad.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {GALERIA.map((g) => (
                <div
                  key={g.src}
                  className={`relative overflow-hidden ${g.wide ? "col-span-2 row-span-2 aspect-auto" : "aspect-square"}`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={g.wide ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESO ── */}
        <section className="border-b border-brand-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="kicker">El Proceso</p>
              <h2 className="mt-4 text-3xl font-bold text-brand-text sm:text-4xl">
                Así de Fácil
              </h2>
              <div className="brand-line mx-auto mt-6" />
            </div>

            <div className="mt-14 grid gap-12 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-full top-7 hidden h-px w-full -translate-x-1/2 bg-brand-primary/25 sm:block" />
                  )}
                  <span className="font-heading text-5xl font-bold text-brand-primary/40">{step.n}</span>
                  <h3 className="mt-4 font-heading text-base font-semibold tracking-[0.16em] text-brand-text">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-brand-muted">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden px-6 py-32">
          <Image
            src="/fotos/fachada.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-bg/75 to-brand-bg" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
            <p className="kicker">Avanzar es nuestra naturaleza</p>
            <h2 className="text-4xl font-bold leading-tight text-brand-text sm:text-5xl">
              Ingeniería que protege{" "}
              <span className="text-brand-accent">tu inversión</span>
            </h2>
            <div className="brand-line" />
            <p className="max-w-md font-light text-brand-silver">
              Escríbenos la medida de tu llanta, el modelo de tu vehículo o el
              servicio que necesitas y te respondemos al instante.
            </p>
            <a
              href={whatsappLink("Hola, necesito una cotización para mi vehículo")}
              target="_blank"
              rel="noopener noreferrer"
              className="angular mt-2 inline-flex items-center gap-3 bg-brand-primary px-11 py-4 font-heading text-sm font-semibold tracking-[0.16em] text-white shadow-xl shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:opacity-90"
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

-- ============================================================
-- JUARE TIRES — Esquema PostgreSQL
-- Ejecutar en la base de datos: jaure
-- ============================================================

-- ---- Usuarios del CRM ----
CREATE TABLE IF NOT EXISTS crm_usuarios (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'ventas',   -- admin | ventas
  activo        BOOLEAN NOT NULL DEFAULT true,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Uriel (dueño, admin) — contraseña: Juare2026!
INSERT INTO crm_usuarios (username, password_hash, nombre, rol)
VALUES ('uriel', '$2b$10$vqr7p3oq7mC6grUrySy4R.LPhMsEsSMaIA4FqtBsoILquFLRpFQGy', 'Uriel', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Colaborador de ventas — contraseña: Ventas2026!
INSERT INTO crm_usuarios (username, password_hash, nombre, rol)
VALUES ('ventas', '$2b$10$XI/.qK0tSJibfNWdFcw2k.fE/TrQ6Nw6/3QDT0uPOWt21S.i7RWbq', 'Colaborador Ventas', 'ventas')
ON CONFLICT (username) DO NOTHING;

-- ---- Solicitudes de cotización (principal — lo que guarda el chatbot) ----
CREATE TABLE IF NOT EXISTS solicitudes (
  id            SERIAL PRIMARY KEY,
  telefono      TEXT NOT NULL,
  nombre        TEXT,
  canal         TEXT NOT NULL DEFAULT 'whatsapp',  -- whatsapp | messenger | webchat | formulario
  productos     TEXT,                              -- texto libre con lo que pidió el cliente
  estado        TEXT NOT NULL DEFAULT 'Nuevo',     -- Nuevo | Escalado | Atendido | Cerrado
  prioridad     TEXT NOT NULL DEFAULT 'MEDIA',     -- BAJA | MEDIA | ALTA
  bot_bloqueado BOOLEAN NOT NULL DEFAULT false,    -- true = no responde el bot a este cliente
  notas         TEXT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_telefono ON solicitudes(telefono);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado   ON solicitudes(estado);

-- ---- FAQ (el agente IA y el CRM la leen) ----
CREATE TABLE IF NOT EXISTS faq (
  id        SERIAL PRIMARY KEY,
  pregunta  TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  activo    BOOLEAN NOT NULL DEFAULT true
);

-- FAQ inicial de Juare Tires
INSERT INTO faq (pregunta, respuesta) VALUES
  ('¿Qué tipos de llantas manejan?',
   'Manejamos llantas nuevas de múltiples marcas y llantas seminuevas garantizadas para todo tipo de vehículo.'),
  ('¿Hacen alineación y balanceo?',
   'Sí, contamos con servicio de alineación, balanceo, montaje y desmontaje de llantas.'),
  ('¿Cuál es su horario?',
   'Nuestro horario es de lunes a sábado de 9:00 a 18:00 hrs.'),
  ('¿Dónde están ubicados?',
   'Estamos ubicados en *(por confirmar con el cliente)*. Escríbenos por WhatsApp para indicaciones exactas.'),
  ('¿Hacen reparación de llantas ponchadas?',
   'Sí, reparamos llantas ponchadas con parche de calidad. El servicio es rápido y económico.'),
  ('¿Cómo puedo pedir una cotización?',
   'Solo dinos la medida de tu llanta (por ejemplo 205/55 R16) y te damos precio al momento.')
ON CONFLICT DO NOTHING;

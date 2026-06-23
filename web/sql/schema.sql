-- ============================================================
-- JUARE TIRES — Esquema PostgreSQL
-- Ejecutar con el usuario admin en la BD del proyecto.
-- ============================================================

-- ---- Usuarios del CRM ----
CREATE TABLE IF NOT EXISTS crm_usuarios (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre        TEXT NOT NULL,
  activo        BOOLEAN NOT NULL DEFAULT true,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usuario CRM inicial (generar hash con bcrypt antes de insertar)
-- INSERT INTO crm_usuarios (username, password_hash, nombre)
-- VALUES ('admin', '$2a$10$HASH_AQUI', 'Juare Tires')
-- ON CONFLICT (username) DO NOTHING;

-- ---- Contactos / Leads (lo que guarda n8n) ----
CREATE TABLE IF NOT EXISTS contactos (
  id           SERIAL PRIMARY KEY,
  telefono     TEXT NOT NULL,
  nombre       TEXT,
  canal        TEXT,            -- whatsapp | messenger | webchat | formulario
  primer_msg   TEXT,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contactos_telefono ON contactos(telefono);

-- ---- Conversaciones (historial del chatbot) ----
CREATE TABLE IF NOT EXISTS conversaciones (
  id           SERIAL PRIMARY KEY,
  telefono     TEXT NOT NULL,
  canal        TEXT,
  rol          TEXT NOT NULL,   -- user | assistant
  contenido    TEXT NOT NULL,
  timestamp    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conv_telefono ON conversaciones(telefono);

-- ---- FAQ (alimenta el agente de IA) ----
CREATE TABLE IF NOT EXISTS faq (
  id        SERIAL PRIMARY KEY,
  pregunta  TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  activo    BOOLEAN NOT NULL DEFAULT true
);

-- ---- Usuario de solo lectura para el CRM ----
-- CREATE USER crm_readonly WITH PASSWORD 'CAMBIAR_PASSWORD';
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO crm_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO crm_readonly;

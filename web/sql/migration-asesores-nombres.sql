-- ============================================================
-- JUARE TIRES — Migración: nombres reales de asesores (a1..a5)
-- Ejecutar en la base de datos: jaure
-- ============================================================

CREATE TABLE IF NOT EXISTS asesores (
  turno       TEXT PRIMARY KEY,   -- a1 | a2 | a3 | a4 | a5 (coincide con turno_asesor del flujo n8n)
  nombre      TEXT NOT NULL,
  actualizado TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO asesores (turno, nombre) VALUES
  ('a1', 'Asesor 1'),
  ('a2', 'Asesor 2'),
  ('a3', 'Asesor 3'),
  ('a4', 'Asesor 4'),
  ('a5', 'Asesor 5')
ON CONFLICT (turno) DO NOTHING;

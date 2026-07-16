-- ============================================================
-- JUARE TIRES — Migración: soporte para flujo n8n con 4 asesores
-- Ejecutar en la base de datos: jaure (después de schema.sql)
-- ============================================================

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS asesor          TEXT,
  ADD COLUMN IF NOT EXISTS ultimo_mensaje  TEXT,
  ADD COLUMN IF NOT EXISTS historial       TEXT,
  ADD COLUMN IF NOT EXISTS fecha_pausa_bot TIMESTAMPTZ;

-- El flujo hace UPSERT por teléfono (ON CONFLICT (telefono)) — requiere UNIQUE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'solicitudes_telefono_key'
  ) THEN
    ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_telefono_key UNIQUE (telefono);
  END IF;
END $$;

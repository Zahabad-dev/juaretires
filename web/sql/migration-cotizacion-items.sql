-- ============================================================
-- JUARE TIRES — Migración: items de cotización (editable en CRM)
-- Ejecutar en la base de datos: jaure
-- ============================================================

CREATE TABLE IF NOT EXISTS solicitud_items (
  id              SERIAL PRIMARY KEY,
  solicitud_id    INTEGER NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  producto        TEXT NOT NULL,
  cantidad        INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2),          -- NULL = pendiente de capturar por el asesor
  orden           INTEGER NOT NULL DEFAULT 0,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_solicitud_items_solicitud ON solicitud_items(solicitud_id);

-- Evita que el mismo producto se duplique si el bot llama registrar_ticket
-- varias veces con la misma descripcion en una conversacion.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'solicitud_items_solicitud_producto_key'
  ) THEN
    ALTER TABLE solicitud_items
      ADD CONSTRAINT solicitud_items_solicitud_producto_key UNIQUE (solicitud_id, producto);
  END IF;
END $$;

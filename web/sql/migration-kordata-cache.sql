-- ============================================================
-- JUARE TIRES — Migración: copia local del catálogo Kordata
-- Ejecutar en la base de datos: jaure
-- ============================================================

CREATE TABLE IF NOT EXISTS kordata_productos_cache (
  kordata_id    INTEGER PRIMARY KEY,
  sku           TEXT,
  nombre        TEXT NOT NULL,
  precio_venta  NUMERIC(10,2),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kordata_cache_nombre ON kordata_productos_cache USING gin (to_tsvector('spanish', nombre));

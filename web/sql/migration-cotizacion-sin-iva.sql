-- ============================================================
-- JUARE TIRES — Migración: opción "sin IVA" en la cotización
-- Ejecutar en la base de datos: jaure
-- ============================================================

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS sin_iva BOOLEAN NOT NULL DEFAULT false;

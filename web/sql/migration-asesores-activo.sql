-- ============================================================
-- JUARE TIRES — Migración: activar/desactivar asesores en la rotación
-- Ejecutar en la base de datos: jaure
-- ============================================================

ALTER TABLE asesores
  ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT true;

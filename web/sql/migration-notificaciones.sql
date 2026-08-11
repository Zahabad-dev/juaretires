-- ============================================================
-- JUARE TIRES — Migración: notificación de leads en el CRM
-- Ejecutar en la base de datos: jaure (después de migration-asesores.sql)
-- ============================================================

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS notificado BOOLEAN NOT NULL DEFAULT true;

-- Los leads nuevos que el bot escala deben nacer como "no notificado"
-- para que la campanita del CRM los cuente; el resto de filas existentes
-- se marcan como ya vistas para no generar ruido retroactivo.

-- ============================================================
-- JUARE TIRES — Migración: recordatorio de cotización pendiente
-- Ejecutar en la base de datos: jaure
-- ============================================================

-- cotizacion_generada_en: se marca sola la primera vez que el
-- vendedor guarda al menos un producto con precio real (ver
-- guardarCotizacionAction). A partir de ahí empieza a contar el
-- reloj del recordatorio.
-- cotizacion_enviada: el vendedor la marca manualmente desde
-- /crm/cotizacion/[id] cuando ya se la mandó al cliente por
-- WhatsApp. Mientras siga en false, el recordatorio insiste.
-- cotizacion_recordatorio_en: última vez que se le avisó al
-- asesor por notificación push, para espaciar los avisos.
ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS cotizacion_generada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cotizacion_enviada BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cotizacion_enviada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cotizacion_recordatorio_en TIMESTAMPTZ;

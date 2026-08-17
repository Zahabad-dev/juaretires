-- ============================================================
-- JUARE TIRES — Migración: promociones, instituciones y cupones
-- Ejecutar en la base de datos: jaure
-- ============================================================

-- Catálogo único: promociones fijas, descuentos por institución y cupones
-- son todos filas de esta misma tabla (misma mecánica: % de descuento
-- que el vendedor activa manualmente en la cotización). "categoria" es
-- solo para agrupar en el selector, no cambia el cálculo.
CREATE TABLE IF NOT EXISTS promociones (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  porcentaje  NUMERIC(5,2) NOT NULL,
  categoria   TEXT NOT NULL DEFAULT 'promocion',  -- promocion | institucion | cupon
  activo      BOOLEAN NOT NULL DEFAULT true,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO promociones (nombre, porcentaje, categoria)
VALUES ('Alineación y balanceo', 10, 'promocion')
ON CONFLICT DO NOTHING;

-- Cotización: promoción activa en esta cotización. Se guarda una
-- "foto" del nombre y porcentaje al momento de aplicarla (no una
-- referencia viva) para que si luego cambia el catálogo, las
-- cotizaciones ya guardadas no cambien de valor.
ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS promocion_id INTEGER REFERENCES promociones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS promocion_nombre TEXT,
  ADD COLUMN IF NOT EXISTS promocion_porcentaje NUMERIC(5,2);

-- Por renglón: si la promoción activa de la cotización aplica a este
-- producto/servicio o no (el vendedor decide, ej. solo alineación).
ALTER TABLE solicitud_items
  ADD COLUMN IF NOT EXISTS aplica_promocion BOOLEAN NOT NULL DEFAULT true;

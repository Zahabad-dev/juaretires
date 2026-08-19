-- ============================================================
-- JUARE TIRES — Migración: numeración independiente de cotización
-- Ejecutar en la base de datos: jaure
-- ============================================================

-- Antes, el "número de cotización" impreso era el id de solicitudes
-- (una fila por CLIENTE, no por cotización -- se sobrescribe cada vez
-- que ese cliente pide una nueva). Eso significa que si un cliente
-- pedía una cotización hoy y otra distinta mañana, salía el MISMO
-- número las dos veces, dos documentos distintos con el mismo folio.
--
-- Contador propio, independiente del id, para que cada cotización
-- real tenga un folio único incremental. Empieza en -1 para que el
-- primer folio asignado sea 0 (#0000).
CREATE TABLE IF NOT EXISTS cotizacion_contador (
  id           SMALLINT PRIMARY KEY DEFAULT 1,
  ultimo_numero INTEGER NOT NULL DEFAULT -1,
  CONSTRAINT una_sola_fila CHECK (id = 1)
);
INSERT INTO cotizacion_contador (id, ultimo_numero) VALUES (1, -1)
ON CONFLICT DO NOTHING;

-- Folio asignado a la cotización actualmente guardada en esta
-- solicitud. Se reasigna a un folio NUEVO cada vez que se empieza una
-- cotización distinta para el mismo cliente (ver guardarCotizacionAction
-- en el código: se detecta por cotizacion_enviada = true antes de
-- guardar, o folio aún sin asignar).
ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS numero_cotizacion INTEGER;

-- ============================================================
-- JUARE TIRES — Migración: limitar productos_estrella a 5 filas
-- Ejecutar en la base de datos: jaure (después de migration-productos-estrella.sql)
-- ============================================================

CREATE OR REPLACE FUNCTION limitar_productos_estrella() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM productos_estrella) >= 5 THEN
    RAISE EXCEPTION 'productos_estrella esta limitado a 5 productos';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_limitar_productos_estrella ON productos_estrella;
CREATE TRIGGER trg_limitar_productos_estrella
  BEFORE INSERT ON productos_estrella
  FOR EACH ROW EXECUTE FUNCTION limitar_productos_estrella();

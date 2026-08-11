-- ============================================================
-- JUARE TIRES — Migración: productos estrella (editables en CRM)
-- Ejecutar en la base de datos: jaure
-- ============================================================

CREATE TABLE IF NOT EXISTS productos_estrella (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  medida      TEXT,
  descripcion TEXT NOT NULL,
  imagen      TEXT NOT NULL,   -- ruta dentro de /public, ej. /productos/archivo.webp
  orden       INTEGER NOT NULL DEFAULT 0,
  activo      BOOLEAN NOT NULL DEFAULT true,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO productos_estrella (nombre, medida, descripcion, imagen, orden) VALUES
  ('Massimo Ottima Plus', '175/70 R13',
   'Llanta económica para autos compactos, con buen agarre en piso mojado y rodamiento suave para ciudad.',
   '/productos/175-70R13_Massimo_Ottima_Plus.webp', 1),
  ('Goodyear Eagle Sport 2', '205/55 R16',
   'Llanta deportiva de alto desempeño, con mayor control en curvas y frenado corto para manejo dinámico.',
   '/productos/205-55R16_Goodyear_Eagle_Sport_2.webp', 2),
  ('Sierra Comfort Ride HP', '205/70 R14',
   'Llanta de confort para sedán, con rodamiento silencioso y suave en trayectos largos.',
   '/productos/205-70R14_Sierra_Comfort_Ride_HP.webp', 3),
  ('Toyo Open Country A/T III', '235/75 R15',
   'Llanta todo terreno para camioneta, con tracción resistente en asfalto, tierra y grava.',
   '/productos/235-75R15_Toyo_Open_Country_AT3.webp', 4),
  ('Toyo Open Country A/T III LT', '265/70 R17',
   'Llanta todo terreno reforzada (LT) para pickup, con alta resistencia de carga en cualquier terreno.',
   '/productos/265-70R17_Toyo_Open_Country_AT3_LT.webp', 5)
ON CONFLICT DO NOTHING;

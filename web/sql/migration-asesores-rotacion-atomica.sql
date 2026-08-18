-- ============================================================
-- JUARE TIRES — Migración: rotación de asesores a prueba de carreras
-- Ejecutar en la base de datos: jaure
-- ============================================================

-- Antes, el turno del round-robin se calculaba en memoria dentro del
-- Code node "Detectar Alerta Asesor1" ($getWorkflowStaticData), lo cual
-- no es seguro cuando llegan varios mensajes casi al mismo tiempo: dos
-- ejecuciones pueden leer el mismo contador antes de que ninguna lo
-- actualice, y ambas caen en el mismo asesor. Confirmado con una prueba
-- de 5 mensajes simulados el 2026-08-18 -- 4 de 5 cayeron en el mismo
-- asesor en vez de repartirse.
--
-- Nuevo mecanismo: "menos usado recientemente" con bloqueo real de fila
-- en Postgres (SELECT ... FOR UPDATE), que sí es seguro bajo concurrencia
-- -- ver nodo "Avanzar Turno Rotacion" en el flujo de n8n.
ALTER TABLE asesores
  ADD COLUMN IF NOT EXISTS ultimo_asignado_en TIMESTAMPTZ;

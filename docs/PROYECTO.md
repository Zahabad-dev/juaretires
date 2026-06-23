---
tags: [juare-tires, chatbot, black-sheep]
creada: 2026-06-23
actualizada: 2026-06-23
---

# Juare Tires — Black Sheep Agencia

> Proyecto web + chatbot para la llantera Juare Tires.
> Generado desde la plantilla chatbot de Black Sheep Agencia.

## Qué incluye

- **Web** (`/web`): Next.js 16 + TS + Tailwind v4 + NextAuth v5 + PostgreSQL
  - Sitio público (Hero, Servicios, CTA WhatsApp)
  - CRM interno con login y tablas editables
  - Páginas legales (política de privacidad, términos)
- **n8n** (`/n8n/chat-general.json`): flujo chatbot multicanal
  - Canales: WhatsApp (YCloud), Messenger, Webchat, Formulario
  - Normalización de canales, transcripción de audio (Whisper), agente IA (GPT-4o-mini)
  - Guarda historial en PostgreSQL
- **Docs** (`/docs`):
  - `DEPLOY-VERCEL.md` — guía paso a paso para Vercel
  - `DEPLOY-EASYPANEL.md` — guía para Easypanel (BD + app en mismo servidor)

## Datos del negocio

| Campo | Valor |
|---|---|
| Nombre | Juare Tires |
| Giro | Llantera / servicio automotriz |
| Servicios | Llantas nuevas y seminuevas, alineación, balanceo, montaje, reparación |
| WhatsApp | *(por configurar)* |
| Email | *(por configurar)* |
| Dominio | *(por configurar)* |

## Historial

- **2026-06-23** — Proyecto creado por Black Sheep Agencia desde plantilla chatbot.

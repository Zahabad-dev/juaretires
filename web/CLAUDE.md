@AGENTS.md

# Proyecto: Juare Tires

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4
- PostgreSQL (Easypanel o Supabase según el proyecto)
- NextAuth v5 (Credentials — CRM interno)
- n8n (chatbot WhatsApp/Messenger/webchat — ver /n8n/chat-general.json)

## Tokens de marca
Todos los colores están en `src/app/globals.css` bajo `:root`.

## Convenciones
- `src/lib/db.ts` exporta `query()` y `CRM_TABLES`. Si se agregan tablas, editar ahí.
- `src/lib/whatsapp.ts` genera los links de WhatsApp; el número viene de `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- El CRM vive en `/crm` y requiere sesión activa.
- Las páginas legales (`/politica-de-privacidad`, `/terminos-del-servicio`) son estáticas.

## Variables de entorno requeridas
Ver `.env.example`.

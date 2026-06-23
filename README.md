# JUARE TIRES — Black Sheep Agencia

Proyecto web + chatbot para Juare Tires. Generado desde la plantilla chatbot de Black Sheep Agencia.

## Estructura

```
JUARE TIRES/
├── web/                  # Next.js 16 + TS + Tailwind v4 + NextAuth + PostgreSQL
│   ├── src/
│   │   ├── app/          # App Router: página pública, CRM, API auth, legales
│   │   ├── components/   # Header, Footer
│   │   ├── lib/          # db.ts (PostgreSQL), whatsapp.ts (links WA)
│   │   └── auth.ts       # NextAuth v5 con Credentials
│   ├── sql/schema.sql    # Tablas: contactos, conversaciones, faq, crm_usuarios
│   ├── .env.example      # Variables requeridas
│   └── CLAUDE.md         # Contexto para Claude al abrir el proyecto
├── n8n/
│   └── chat-general.json # Flujo chatbot: WA + Messenger + Webchat + Form → IA → BD
└── docs/
    ├── DEPLOY-VERCEL.md   # Deploy en Vercel paso a paso
    ├── DEPLOY-EASYPANEL.md # Deploy en Easypanel paso a paso
    └── PROYECTO.md        # Nota de bóveda + instrucciones
```

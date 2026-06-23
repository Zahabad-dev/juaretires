# Deploy en Easypanel — Juare Tires

> Para proyectos CRM/portal que requieren servidor propio, BD integrada o que no se pueden exponer en Vercel.

## Cuándo usar Easypanel vs Vercel

| Criterio | Easypanel | Vercel |
|---|---|---|
| BD en el mismo servidor | ✅ | ❌ |
| Sitio público de vitrina | posible | ✅ preferido |
| n8n en el mismo host | ✅ | ❌ |
| Zero-config deploy | ❌ | ✅ |
| IP fija | ✅ | ❌ |

---

## 1. Crear el servicio de la app

1. Entrar a Easypanel → proyecto del cliente → **Create Service → App**
2. Nombre: `juare-tires`
3. Source: **GitHub** (conectar repo si no está conectado) o **Docker**

### Opción A — Deploy directo desde GitHub

- Repository: *(repo de Juare Tires)*
- Branch: `main`
- Build Path: `/web` (si el repo tiene varias carpetas)
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: `3000`

### Opción B — Dockerfile (recomendado para mayor control)

Crear `web/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Y agregar en `next.config.ts`:
```ts
const nextConfig: NextConfig = { output: "standalone" };
```

---

## 2. Variables de entorno en Easypanel

En el servicio → **Environment**:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=521XXXXXXXXXX
DATABASE_URL=postgresql://crm_readonly:PASS@postgres:5432/juare_tires
NEXTAUTH_URL=https://juaretires.tu-servidor.com
AUTH_SECRET=SECRETO_GENERADO
```

> Si PostgreSQL corre en el mismo Easypanel, el host es el nombre del servicio de BD (ej. `postgres`), no `localhost`.

---

## 3. Base de datos PostgreSQL en Easypanel

1. **Create Service → PostgreSQL**
2. Nombre: `juare-tires-db`
3. Anotar credenciales generadas
4. Conectarse con DBeaver o psql y ejecutar `/web/sql/schema.sql`

```bash
psql postgresql://admin:PASS@HOST:5432/juare_tires -f web/sql/schema.sql
```

---

## 4. Dominio / proxy

- En el servicio → **Domains** → agregar subdominio o dominio propio
- Easypanel gestiona el certificado SSL automáticamente (Traefik)

---

## 5. Verificar post-deploy

- [ ] Servicio en estado **Running**
- [ ] Dominio responde con HTTPS
- [ ] Logs sin errores (revisar tab **Logs**)
- [ ] `/crm/login` autentica correctamente
- [ ] n8n puede alcanzar la BD en la misma red de Easypanel

---

## 6. Actualizar

Cada push a `main` dispara re-deploy automático si el repo está conectado.
Para deploy manual desde Easypanel: botón **Deploy** en el servicio.

---

## Notas importantes

- `NEXTAUTH_URL` debe coincidir exactamente con el dominio (incluir `https://` y sin `/` final).
- Si n8n está en el mismo Easypanel, usar el nombre del servicio de BD como host (red interna Docker).
- Para conectar n8n a la BD usar el usuario `admin`, no `crm_readonly` (n8n necesita escribir).

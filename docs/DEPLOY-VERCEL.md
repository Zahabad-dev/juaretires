# Deploy en Vercel — Juare Tires

> Para proyectos de sitio web público + CRM. Si el proyecto requiere BD persistente en servidor propio, usa Easypanel.

## Requisitos previos
- Cuenta Vercel (ya tienes la de Black Sheep)
- Repositorio GitHub/GitLab con el código del proyecto (rama `main`)
- Base de datos PostgreSQL accesible desde internet (Supabase, Railway, o Easypanel con IP pública)

---

## 1. Preparar el repositorio

```bash
cd web
npm install
npm run build         # verificar que compila sin errores
```

Asegúrate de que `.env.local` NO está en el repositorio (`.gitignore` ya lo excluye).

---

## 2. Crear proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com) → **New Project**
2. Importar el repositorio del proyecto
3. Framework: **Next.js** (Vercel lo detecta solo)
4. Root Directory: `web` (si el repo tiene más carpetas)
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)

---

## 3. Variables de entorno en Vercel

En **Settings → Environment Variables**, agregar:

| Variable | Ambiente | Valor |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Production, Preview | número de Juare Tires |
| `DATABASE_URL` | Production | `postgresql://crm_readonly:PASS@HOST:5432/juare_tires` |
| `NEXTAUTH_URL` | Production | `https://juare-tires.vercel.app` |
| `AUTH_SECRET` | Production | secreto generado con `openssl rand -base64 32` |

---

## 4. Deploy

Hacer push a `main` dispara deploy automático. Para deploy manual:

```bash
npx vercel --prod
```

---

## 5. Dominio personalizado (opcional)

**Settings → Domains** → agregar el dominio de Juare Tires.
Agregar los DNS que Vercel indique en el panel del registrador.

---

## 6. Verificar post-deploy

- [ ] Sitio público carga en producción
- [ ] Botones de WhatsApp tienen el número correcto
- [ ] `/crm/login` funciona y autentica
- [ ] `/crm` muestra el panel con datos de la BD
- [ ] `/politica-de-privacidad` y `/terminos-del-servicio` cargan

---

## Notas importantes

- Vercel inyecta automáticamente `VERCEL_URL` — no confundir con `NEXTAUTH_URL`.
- Si la BD es Easypanel, asegurarse de que el puerto PostgreSQL (5432) está expuesto o el proxy de Easypanel está activo.
- `trustHost: true` ya está en `auth.ts` para evitar el error de host en producción.

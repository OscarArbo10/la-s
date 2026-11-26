# Joyería La S — Catálogo Móvil & Panel Admin

Aplicación web **mobile-first** en estética **Negro & Oro** con estilos dinámicos configurables, catálogo interactivo de joyas (peso en gramos, material, pureza, medidas y piedra), bolsa de consulta directa por **WhatsApp**, panel de administración protegido y almacenamiento de imágenes en **Supabase**, lista para desplegar en **Vercel**.

---

## Stack Tecnológico

- **Frontend & SSR/ISR:** Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Base de datos, Auth y Storage:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Despliegue:** Vercel

---

## 1. Configuración de Supabase

1. Crea un proyecto nuevo en [Supabase](https://supabase.com/dashboard).
2. Ve a **SQL Editor** en el panel de Supabase, abre el archivo [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql), copia todo su contenido y ejecútalo.
   - Esto crea las tablas `categories`, `products` y `site_settings`.
   - Activa **Row Level Security (RLS)** con lectura pública solo de elementos activos y escritura exclusiva para usuarios con rol `admin` en `app_metadata`.
   - Crea el bucket público `jewelry-images` con políticas de subida y borrado para el administrador.
   - Carga categorías y 4 joyas iniciales de ejemplo.
3. Crea tu usuario administrador:
   - En **Authentication → Users**, crea un usuario con correo y contraseña.
   - Luego, en **SQL Editor**, asígnale el rol `admin` en `raw_app_meta_data` (reemplazando el correo):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'tu-correo-admin@ejemplo.com';
```

---

## 2. Variables de Entorno

Copia `.env.example` a `.env.local` y completa tus credenciales desde **Supabase → Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_clave_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Nota:** Si aún no configuras `.env.local`, la tienda pública funciona en **modo demostración** con joyas de ejemplo para que puedas previsualizar el diseño inmediatamente.

---

## 3. Desarrollo Local

```bash
npm install
npm run dev
```

- **Tienda móvil:** `http://localhost:3000`
- **Panel administrador:** `http://localhost:3000/admin`

---

## 4. Despliegue en Vercel

1. Sube este proyecto a un repositorio de GitHub/GitLab/Bitbucket.
2. Impórtalo en [Vercel](https://vercel.com/new).
3. Agrega las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` con tu dominio `.vercel.app` o personalizado).
4. Despliega. Cada cambio que realices desde `/admin` revalida automáticamente las rutas del catálogo.

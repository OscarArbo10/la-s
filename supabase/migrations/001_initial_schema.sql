-- ============================================================================
-- Joyería La S - Esquema inicial, RLS, índices y Storage para Supabase
-- ============================================================================

-- 1. Función segura para actualizar updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Tabla de categorías
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Tabla de productos (joyas)
create table if not exists public.products (
  id bigint generated always as identity primary key,
  sku text not null unique,
  name text not null,
  slug text not null unique,
  category_id bigint references public.categories(id) on delete set null,
  description text,
  material text not null,
  purity text,
  weight_grams numeric(8,2),
  dimensions text,
  stone text,
  price numeric(12,2),
  show_price boolean not null default true,
  status text not null default 'available'
    check (status in ('available', 'made_to_order', 'sold_out')),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- Índices para filtrado móvil rápido
create index if not exists idx_categories_active_order
  on public.categories (display_order asc, id asc)
  where is_active = true;

create index if not exists idx_products_active_category
  on public.products (category_id, created_at desc)
  where is_active = true;

create index if not exists idx_products_material
  on public.products (material)
  where is_active = true;

-- 4. Configuración dinámica de tienda y estilos (fila única id = 1)
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'Joyería La S',
  whatsapp_number text not null default '573001234567',
  whatsapp_greeting text not null default 'Hola Joyería La S ✨, me interesa esta joya:',
  theme_config jsonb not null default '{
    "preset": "classic-gold",
    "accentGold": "#D4AF37",
    "accentGoldLight": "#F5E6A8",
    "accentGoldMuted": "#8A6D1C",
    "bgPrimary": "#09090B",
    "bgSurface": "#141417",
    "cardLayout": "grid-2",
    "heroEyebrow": "Alta Joyería",
    "heroTitle": "Elegancia en Negro & Oro",
    "heroSubtitle": "Piezas seleccionadas en oro de 18k y plata ley 925 con asesoría personalizada.",
    "promoBanner": "Envíos asegurados a todo el país • Asesoría directa por WhatsApp"
  }'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

-- 5. Permisos explícitos para Data API
grant select on public.categories, public.products, public.site_settings to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.site_settings to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- 6. Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

-- Lectura pública: solo elementos activos y configuración de tienda
create policy "Public read active categories"
  on public.categories for select
  to anon, authenticated
  using (is_active = true);

create policy "Public read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

create policy "Public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Lectura completa y escritura exclusiva para admin (app_metadata.role = 'admin')
create policy "Admin read all categories"
  on public.categories for select
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin insert categories"
  on public.categories for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin update categories"
  on public.categories for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin delete categories"
  on public.categories for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin read all products"
  on public.products for select
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin insert products"
  on public.products for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin update products"
  on public.products for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin delete products"
  on public.products for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin insert site settings"
  on public.site_settings for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin update site settings"
  on public.site_settings for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 7. Supabase Storage: Bucket público para fotos de joyas
insert into storage.buckets (id, name, public)
values ('jewelry-images', 'jewelry-images', true)
on conflict (id) do nothing;

create policy "Public read jewelry images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'jewelry-images');

create policy "Admin insert jewelry images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'jewelry-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admin update jewelry images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'jewelry-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'jewelry-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admin delete jewelry images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'jewelry-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 8. Datos iniciales semilla
insert into public.site_settings (id, store_name, whatsapp_number)
values (1, 'Joyería La S', '573001234567')
on conflict (id) do nothing;

insert into public.categories (name, slug, display_order, is_active)
values
  ('Anillos', 'anillos', 1, true),
  ('Cadenas', 'cadenas', 2, true),
  ('Aretes', 'aretes', 3, true),
  ('Pulseras', 'pulseras', 4, true)
on conflict (slug) do nothing;

insert into public.products (
  sku, name, slug, category_id, description, material, purity,
  weight_grams, dimensions, stone, price, show_price, status, is_featured, is_active
)
values
  (
    'LS-AN-001',
    'Anillo Solitario Imperial',
    'anillo-solitario-imperial',
    (select id from public.categories where slug = 'anillos' limit 1),
    'Anillo solitario de perfil clásico con engaste de seis uñas que realza el brillo central. Acabado espejo hecho a mano.',
    'Oro Amarillo 18k',
    '750',
    4.20,
    'Talla 7 (ajustable 6-8)',
    'Zirconia Suiza 6mm',
    1850000,
    true,
    'available',
    true,
    true
  ),
  (
    'LS-CA-002',
    'Cadena Tejido Chino Maciza',
    'cadena-tejido-chino-maciza',
    (select id from public.categories where slug = 'cadenas' limit 1),
    'Cadena de eslabones compactos con broche de seguridad tipo mosquetón. Ideal para uso diario o con dije.',
    'Oro Amarillo 18k',
    '750',
    11.50,
    '50 cm x 3.2 mm',
    'Sin piedra',
    4600000,
    true,
    'available',
    true,
    true
  ),
  (
    'LS-AR-003',
    'Topos Corona Esmeralda',
    'topos-corona-esmeralda',
    (select id from public.categories where slug = 'aretes' limit 1),
    'Aretes tipo topo con cierre roscado de seguridad y halo luminoso en contraste dorado.',
    'Oro 18k',
    '750',
    2.40,
    '8 mm diámetro',
    'Esmeralda natural',
    1390000,
    true,
    'made_to_order',
    false,
    true
  ),
  (
    'LS-PU-004',
    'Pulsera Cartier Diamantada',
    'pulsera-cartier-diamantada',
    (select id from public.categories where slug = 'pulseras' limit 1),
    'Pulsera clásica de eslabones 3x1 con cortes diamantados que reflejan la luz en cada movimiento.',
    'Plata Ley 925 con baño de Oro 18k',
    '925',
    9.80,
    '19 cm',
    'Sin piedra',
    380000,
    true,
    'available',
    false,
    true
  )
on conflict (sku) do nothing;

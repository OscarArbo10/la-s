import type { Category, Product, SiteSettings, ThemeConfig, ThemePresetId } from "@/types/database";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  accentGold: string;
  accentGoldLight: string;
  accentGoldMuted: string;
  bgPrimary: string;
  bgSurface: string;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  "classic-gold": {
    id: "classic-gold",
    name: "Negro & Oro Clásico",
    description: "Negro profundo OLED con dorado real 24k",
    accentGold: "#D4AF37",
    accentGoldLight: "#F5E6A8",
    accentGoldMuted: "#8A6D1C",
    bgPrimary: "#09090B",
    bgSurface: "#141417",
  },
  "rose-gold": {
    id: "rose-gold",
    name: "Nocturno & Oro Rosa",
    description: "Contraste cálido en tono oro rosado elegante",
    accentGold: "#D89A8C",
    accentGoldLight: "#F6D5CD",
    accentGoldMuted: "#8E5A4F",
    bgPrimary: "#0A090B",
    bgSurface: "#161316",
  },
  "champagne-noir": {
    id: "champagne-noir",
    name: "Champán & Ébano",
    description: "Dorado champán suave sobre negro carbón",
    accentGold: "#C8B273",
    accentGoldLight: "#EDE2BC",
    accentGoldMuted: "#7E6D3E",
    bgPrimary: "#0B0B0D",
    bgSurface: "#151519",
  },
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  preset: "classic-gold",
  accentGold: THEME_PRESETS["classic-gold"].accentGold,
  accentGoldLight: THEME_PRESETS["classic-gold"].accentGoldLight,
  accentGoldMuted: THEME_PRESETS["classic-gold"].accentGoldMuted,
  bgPrimary: THEME_PRESETS["classic-gold"].bgPrimary,
  bgSurface: THEME_PRESETS["classic-gold"].bgSurface,
  cardLayout: "grid-2",
  heroEyebrow: "Alta Joyería",
  heroTitle: "Elegancia en Negro & Oro",
  heroSubtitle:
    "Piezas seleccionadas en oro de 18k y plata ley 925 con asesoría directa y envíos asegurados.",
  promoBanner: "Envíos asegurados a todo el país • Atención personalizada por WhatsApp",
};

export const DEMO_SETTINGS: SiteSettings = {
  id: 1,
  store_name: "Joyería La S",
  whatsapp_number: "573001234567",
  whatsapp_greeting: "Hola Joyería La S ✨, me interesa esta joya:",
  theme_config: DEFAULT_THEME_CONFIG,
  updated_at: "2026-11-25T00:00:00.000Z",
};

export const DEMO_CATEGORIES: Category[] = [
  { id: 1, name: "Anillos", slug: "anillos", display_order: 1, is_active: true, created_at: "2026-11-25T00:00:00.000Z" },
  { id: 2, name: "Cadenas", slug: "cadenas", display_order: 2, is_active: true, created_at: "2026-11-25T00:00:00.000Z" },
  { id: 3, name: "Aretes", slug: "aretes", display_order: 3, is_active: true, created_at: "2026-11-25T00:00:00.000Z" },
  { id: 4, name: "Pulseras", slug: "pulseras", display_order: 4, is_active: true, created_at: "2026-11-25T00:00:00.000Z" },
  { id: 5, name: "Dijes", slug: "dijes", display_order: 5, is_active: true, created_at: "2026-11-25T00:00:00.000Z" },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: "LS-AN-001",
    name: "Anillo Solitario Imperial",
    slug: "anillo-solitario-imperial",
    category_id: 1,
    category: { id: 1, name: "Anillos", slug: "anillos" },
    description:
      "Anillo solitario de perfil clásico con engaste de seis uñas que realza el brillo central. Acabado espejo hecho a mano.",
    material: "Oro Amarillo 18k",
    purity: "750",
    weight_grams: 4.2,
    dimensions: "Talla 7 (ajustable 6-8)",
    stone: "Zirconia Suiza 6mm",
    price: 1850000,
    show_price: true,
    status: "available",
    is_featured: true,
    is_active: true,
    images: [],
    created_at: "2026-11-25T00:00:00.000Z",
    updated_at: "2026-11-25T00:00:00.000Z",
  },
  {
    id: 2,
    sku: "LS-CA-002",
    name: "Cadena Tejido Chino Maciza",
    slug: "cadena-tejido-chino-maciza",
    category_id: 2,
    category: { id: 2, name: "Cadenas", slug: "cadenas" },
    description:
      "Cadena de eslabones compactos con broche de seguridad tipo mosquetón. Ideal para uso diario o acompañar con dije.",
    material: "Oro Amarillo 18k",
    purity: "750",
    weight_grams: 11.5,
    dimensions: "50 cm × 3.2 mm",
    stone: "Sin piedra",
    price: 4600000,
    show_price: true,
    status: "available",
    is_featured: true,
    is_active: true,
    images: [],
    created_at: "2026-11-24T00:00:00.000Z",
    updated_at: "2026-11-24T00:00:00.000Z",
  },
  {
    id: 3,
    sku: "LS-AR-003",
    name: "Topos Corona Esmeralda",
    slug: "topos-corona-esmeralda",
    category_id: 3,
    category: { id: 3, name: "Aretes", slug: "aretes" },
    description:
      "Aretes tipo topo con cierre roscado de seguridad y halo luminoso en contraste dorado.",
    material: "Oro 18k",
    purity: "750",
    weight_grams: 2.4,
    dimensions: "8 mm diámetro",
    stone: "Esmeralda natural",
    price: 1390000,
    show_price: true,
    status: "made_to_order",
    is_featured: false,
    is_active: true,
    images: [],
    created_at: "2026-11-23T00:00:00.000Z",
    updated_at: "2026-11-23T00:00:00.000Z",
  },
  {
    id: 4,
    sku: "LS-PU-004",
    name: "Pulsera Cartier Diamantada",
    slug: "pulsera-cartier-diamantada",
    category_id: 4,
    category: { id: 4, name: "Pulseras", slug: "pulseras" },
    description:
      "Pulsera clásica de eslabones 3x1 con cortes diamantados que reflejan la luz en cada movimiento.",
    material: "Plata 925 Baño Oro 18k",
    purity: "925",
    weight_grams: 9.8,
    dimensions: "19 cm × 4.5 mm",
    stone: "Sin piedra",
    price: 380000,
    show_price: true,
    status: "available",
    is_featured: false,
    is_active: true,
    images: [],
    created_at: "2026-11-22T00:00:00.000Z",
    updated_at: "2026-11-22T00:00:00.000Z",
  },
  {
    id: 5,
    sku: "LS-AN-005",
    name: "Argolla Matrimonial Bicolor",
    slug: "argolla-matrimonial-bicolor",
    category_id: 1,
    category: { id: 1, name: "Anillos", slug: "anillos" },
    description:
      "Argolla anatómica confortable con franja satinada central y bordes biselados pulidos a mano.",
    material: "Oro Amarillo y Blanco 18k",
    purity: "750",
    weight_grams: 5.6,
    dimensions: "4 mm ancho (bajo talla)",
    stone: "Sin piedra",
    price: null,
    show_price: false,
    status: "made_to_order",
    is_featured: true,
    is_active: true,
    images: [],
    created_at: "2026-11-21T00:00:00.000Z",
    updated_at: "2026-11-21T00:00:00.000Z",
  },
  {
    id: 6,
    sku: "LS-DI-006",
    name: "Dije Inicial La S Biselado",
    slug: "dije-inicial-la-s-biselado",
    category_id: 5,
    category: { id: 5, name: "Dijes", slug: "dijes" },
    description:
      "Medalla minimalista de contorno circular con inicial S en alto relieve y acabado brillante.",
    material: "Oro 18k",
    purity: "750",
    weight_grams: 3.1,
    dimensions: "16 mm diámetro",
    stone: "Microcirconias",
    price: 1240000,
    show_price: true,
    status: "available",
    is_featured: false,
    is_active: true,
    images: [],
    created_at: "2026-11-20T00:00:00.000Z",
    updated_at: "2026-11-20T00:00:00.000Z",
  },
];

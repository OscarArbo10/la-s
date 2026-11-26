export type ProductStatus = "available" | "made_to_order" | "sold_out";

export type CardLayout = "grid-2" | "grid-1";

export type ThemePresetId = "classic-gold" | "rose-gold" | "champagne-noir";

export interface ProductImage {
  url: string;
  path?: string;
  alt?: string;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  category_id: number | null;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  description: string | null;
  material: string;
  purity: string | null;
  weight_grams: number | null;
  dimensions: string | null;
  stone: string | null;
  price: number | null;
  show_price: boolean;
  status: ProductStatus;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  preset: ThemePresetId;
  accentGold: string;
  accentGoldLight: string;
  accentGoldMuted: string;
  bgPrimary: string;
  bgSurface: string;
  cardLayout: CardLayout;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  promoBanner: string;
}

export interface SiteSettings {
  id: number;
  store_name: string;
  whatsapp_number: string;
  whatsapp_greeting: string;
  theme_config: ThemeConfig;
  updated_at: string;
}

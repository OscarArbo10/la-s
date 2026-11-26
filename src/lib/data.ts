import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  DEFAULT_THEME_CONFIG,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SETTINGS,
} from "@/lib/demo-data";
import type { Category, Product, SiteSettings, ThemeConfig } from "@/types/database";

function normalizeThemeConfig(raw: Partial<ThemeConfig> | null | undefined): ThemeConfig {
  return {
    ...DEFAULT_THEME_CONFIG,
    ...(raw ?? {}),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return DEMO_SETTINGS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return DEMO_SETTINGS;
    }

    return {
      ...DEMO_SETTINGS,
      ...data,
      theme_config: normalizeThemeConfig(data.theme_config),
    };
  } catch {
    return DEMO_SETTINGS;
  }
}

export async function getCategories(includeInactive = false): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return includeInactive
      ? DEMO_CATEGORIES
      : DEMO_CATEGORIES.filter((c) => c.is_active);
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error || !data) {
      return DEMO_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function getProducts(includeInactive = false): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return includeInactive
      ? DEMO_PRODUCTS
      : DEMO_PRODUCTS.filter((p) => p.is_active);
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(id, name, slug)")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error || !data) {
      return DEMO_PRODUCTS;
    }

    return (data as Product[]).map((item) => ({
      ...item,
      weight_grams: item.weight_grams !== null ? Number(item.weight_grams) : null,
      price: item.price !== null ? Number(item.price) : null,
      images: Array.isArray(item.images) ? item.images : [],
    }));
  } catch {
    return DEMO_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.find((p) => p.slug === slug && p.is_active) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(id, name, slug)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      ...(data as Product),
      weight_grams: data.weight_grams !== null ? Number(data.weight_grams) : null,
      price: data.price !== null ? Number(data.price) : null,
      images: Array.isArray(data.images) ? data.images : [],
    };
  } catch {
    return null;
  }
}

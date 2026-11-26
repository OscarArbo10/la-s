"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductImage, ProductStatus, ThemeConfig } from "@/types/database";

async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado en .env.local.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    throw new Error("No autorizado. Se requiere cuenta de administrador.");
  }

  return { supabase, user };
}

export async function signInAdminAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local antes de iniciar sesión.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciales inválidas. Verifica correo y contraseña." };
  }

  if (data.user?.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return {
      error:
        "Tu usuario no tiene permisos de administrador (app_metadata.role = 'admin').",
    };
  }

  redirect("/admin");
}

export async function signOutAdminAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export interface ProductInput {
  id?: number;
  sku: string;
  name: string;
  slug: string;
  category_id: number | null;
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
}

export async function upsertProductAction(input: ProductInput) {
  const { supabase } = await requireAdmin();

  const payload = {
    sku: input.sku.trim().toUpperCase(),
    name: input.name.trim(),
    slug: input.slug.trim(),
    category_id: input.category_id,
    description: input.description?.trim() || null,
    material: input.material.trim(),
    purity: input.purity?.trim() || null,
    weight_grams: input.weight_grams,
    dimensions: input.dimensions?.trim() || null,
    stone: input.stone?.trim() || null,
    price: input.price,
    show_price: input.show_price,
    status: input.status,
    is_featured: input.is_featured,
    is_active: input.is_active,
    images: input.images,
  };

  if (input.id) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  return { ok: true, error: null };
}

export async function quickUpdateProductAction(
  id: number,
  patch: Partial<{ is_active: boolean; is_featured: boolean; status: ProductStatus }>
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").update(patch).eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  return { ok: true, error: null };
}

export async function deleteProductAction(id: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  return { ok: true, error: null };
}

export async function upsertCategoryAction(input: {
  id?: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}) {
  const { supabase } = await requireAdmin();

  const payload = {
    name: input.name.trim(),
    slug: input.slug.trim(),
    display_order: Number(input.display_order) || 0,
    is_active: input.is_active,
  };

  if (input.id) {
    const { error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  return { ok: true, error: null };
}

export async function deleteCategoryAction(id: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  return { ok: true, error: null };
}

export async function updateSiteSettingsAction(input: {
  store_name: string;
  whatsapp_number: string;
  whatsapp_greeting: string;
  theme_config: ThemeConfig;
}) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    store_name: input.store_name.trim(),
    whatsapp_number: input.whatsapp_number.replace(/[^\d]/g, ""),
    whatsapp_greeting: input.whatsapp_greeting.trim(),
    theme_config: input.theme_config,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/apariencia");
  return { ok: true, error: null };
}

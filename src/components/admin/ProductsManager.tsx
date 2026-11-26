"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Star,
  Eye,
  EyeOff,
  Loader2,
  ArrowUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImageToWebP, slugify } from "@/lib/image-compress";
import { formatPrice, formatWeight } from "@/lib/whatsapp";
import {
  deleteProductAction,
  quickUpdateProductAction,
  upsertProductAction,
} from "@/app/admin/actions";
import type {
  Category,
  Product,
  ProductImage,
  ProductStatus,
} from "@/types/database";

interface ProductsManagerProps {
  initialProducts: Product[];
  categories: Category[];
  openNewInitially?: boolean;
}

interface FormState {
  id?: number;
  sku: string;
  name: string;
  slug: string;
  category_id: string;
  description: string;
  material: string;
  purity: string;
  weight_grams: string;
  dimensions: string;
  stone: string;
  price: string;
  show_price: boolean;
  status: ProductStatus;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
}

function createEmptyForm(categories: Category[]): FormState {
  return {
    sku: "",
    name: "",
    slug: "",
    category_id: categories[0] ? String(categories[0].id) : "",
    description: "",
    material: "Oro Amarillo 18k",
    purity: "750",
    weight_grams: "",
    dimensions: "",
    stone: "",
    price: "",
    show_price: true,
    status: "available",
    is_featured: false,
    is_active: true,
    images: [],
  };
}

function productToForm(product: Product): FormState {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    category_id: product.category_id ? String(product.category_id) : "",
    description: product.description ?? "",
    material: product.material,
    purity: product.purity ?? "",
    weight_grams:
      product.weight_grams !== null ? String(product.weight_grams) : "",
    dimensions: product.dimensions ?? "",
    stone: product.stone ?? "",
    price: product.price !== null ? String(product.price) : "",
    show_price: product.show_price,
    status: product.status,
    is_featured: product.is_featured,
    is_active: product.is_active,
    images: product.images ?? [],
  };
}

export function ProductsManager({
  initialProducts,
  categories,
  openNewInitially = false,
}: ProductsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(openNewInitially);
  const [form, setForm] = useState<FormState>(() =>
    createEmptyForm(categories)
  );
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = initialProducts.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );
  });

  function openCreate() {
    setForm(createEmptyForm(categories));
    setErrorMsg(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setForm(productToForm(product));
    setErrorMsg(null);
    setModalOpen(true);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const uploaded: ProductImage[] = [];

      for (const file of Array.from(files)) {
        const compressed = await compressImageToWebP(file);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("jewelry-images")
          .upload(filePath, compressed, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("jewelry-images").getPublicUrl(filePath);

        uploaded.push({
          url: publicUrl,
          path: filePath,
          alt: form.name || "Joya Joyería La S",
          order: form.images.length + uploaded.length,
        });
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "No se pudo subir la imagen."
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images
        .filter((_, idx) => idx !== index)
        .map((img, idx) => ({ ...img, order: idx })),
    }));
  }

  function makeCoverImage(index: number) {
    if (index === 0) return;
    setForm((prev) => {
      const copy = [...prev.images];
      const [selected] = copy.splice(index, 1);
      copy.unshift(selected);
      return {
        ...prev,
        images: copy.map((img, idx) => ({ ...img, order: idx })),
      };
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || !form.sku.trim() || !form.material.trim()) {
      setErrorMsg("Nombre, Código SKU y Material son obligatorios.");
      return;
    }

    const computedSlug =
      form.slug.trim() || slugify(`${form.name}-${form.sku}`);

    startTransition(async () => {
      const res = await upsertProductAction({
        id: form.id,
        sku: form.sku,
        name: form.name,
        slug: computedSlug,
        category_id: form.category_id ? Number(form.category_id) : null,
        description: form.description || null,
        material: form.material,
        purity: form.purity || null,
        weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
        dimensions: form.dimensions || null,
        stone: form.stone || null,
        price: form.price ? Number(form.price) : null,
        show_price: form.show_price,
        status: form.status,
        is_featured: form.is_featured,
        is_active: form.is_active,
        images: form.images,
      });

      if (!res.ok) {
        setErrorMsg(res.error ?? "Error al guardar la joya.");
        return;
      }

      setModalOpen(false);
      router.refresh();
    });
  }

  function handleQuickToggle(
    product: Product,
    patch: Partial<{ is_active: boolean; is_featured: boolean; status: ProductStatus }>
  ) {
    startTransition(async () => {
      await quickUpdateProductAction(product.id, patch);
      router.refresh();
    });
  }

  function handleDelete(product: Product) {
    if (!window.confirm(`¿Eliminar "${product.name}" (${product.sku})?`)) {
      return;
    }
    startTransition(async () => {
      await deleteProductAction(product.id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-editorial text-2xl font-bold text-white">
            Administrar Joyas
          </h1>
          <p className="text-xs text-zinc-400">
            {initialProducts.length} piezas registradas
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl gold-button px-4 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          Nueva Joya
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filtrar por nombre, código o material..."
        className="h-10 w-full rounded-xl border border-white/10 bg-[var(--bg-surface)] px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold-primary)] focus:outline-none"
      />

      {/* Listado optimizado para móvil */}
      <div className="space-y-2.5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-3.5"
          >
            <div className="flex items-start gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                {product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-editorial text-xl font-bold gold-gradient-text">
                    S
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[var(--gold-primary)]">
                    {product.sku}
                  </span>
                  <span className="text-xs font-bold text-[var(--gold-light)]">
                    {formatPrice(product.price, product.show_price)}
                  </span>
                </div>

                <h2 className="truncate text-sm font-semibold text-white">
                  {product.name}
                </h2>
                <p className="truncate text-xs text-zinc-400">
                  {product.material}
                  {formatWeight(product.weight_grams)
                    ? ` • ${formatWeight(product.weight_grams)}`
                    : ""}
                  {product.dimensions ? ` • ${product.dimensions}` : ""}
                </p>
              </div>
            </div>

            {/* Acciones rápidas en un toque */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleQuickToggle(product, {
                      is_active: !product.is_active,
                    })
                  }
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                    product.is_active
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  {product.is_active ? (
                    <>
                      <Eye className="h-3 w-3" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" /> Oculta
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleQuickToggle(product, {
                      is_featured: !product.is_featured,
                    })
                  }
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                    product.is_featured
                      ? "border-[var(--gold-primary)]/50 bg-[var(--gold-primary)]/15 text-[var(--gold-light)]"
                      : "border-white/10 bg-black/40 text-zinc-400"
                  }`}
                >
                  <Star className="h-3 w-3" /> Destacada
                </button>

                <select
                  aria-label={`Estado de ${product.name}`}
                  value={product.status}
                  disabled={isPending}
                  onChange={(e) =>
                    handleQuickToggle(product, {
                      status: e.target.value as ProductStatus,
                    })
                  }
                  className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] text-zinc-200"
                >
                  <option value="available">Disponible</option>
                  <option value="made_to_order">Bajo pedido</option>
                  <option value="sold_out">Agotado</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-zinc-200 hover:border-[var(--gold-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  aria-label={`Eliminar ${product.name}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center">
          <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[var(--gold-muted)]/40 bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="font-editorial text-xl font-bold text-white">
                {form.id ? "Editar Joya" : "Nueva Joya"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-4 overflow-y-auto p-4 text-sm"
            >
              {/* Subida de fotos desde celular */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--gold-primary)]">
                  Fotografías (la primera es portada)
                </label>

                <div className="flex flex-wrap gap-2">
                  {form.images.map((img, idx) => (
                    <div
                      key={img.url + idx}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/15 bg-black"
                    >
                      <Image
                        src={img.url}
                        alt={`Foto ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/80 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {idx > 0 ? (
                        <button
                          type="button"
                          onClick={() => makeCoverImage(idx)}
                          title="Hacer portada"
                          className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold-primary)] text-black"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                      ) : (
                        <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1 text-[9px] text-[var(--gold-light)]">
                          Portada
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="flex h-20 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--gold-primary)]/50 bg-black/40 text-xs text-[var(--gold-light)] hover:bg-black/60">
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                    <span>{uploading ? "Subiendo" : "Subir foto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Nombre de la joya *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        name: e.target.value,
                        slug: p.id ? p.slug : slugify(e.target.value),
                      }))
                    }
                    placeholder="Anillo Solitario Imperial"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Código SKU *
                  </label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, sku: e.target.value }))
                    }
                    placeholder="LS-AN-001"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 font-mono uppercase text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Categoría
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category_id: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Material *
                  </label>
                  <input
                    required
                    value={form.material}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, material: e.target.value }))
                    }
                    placeholder="Oro Amarillo 18k"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Peso (gramos)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.weight_grams}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, weight_grams: e.target.value }))
                    }
                    placeholder="4.20"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Ley / Pureza
                  </label>
                  <input
                    value={form.purity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, purity: e.target.value }))
                    }
                    placeholder="750 / 925 / 14k"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Medidas / Talla
                  </label>
                  <input
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dimensions: e.target.value }))
                    }
                    placeholder="Talla 7 / 50 cm"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Piedra / Detalle
                  </label>
                  <input
                    value={form.stone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, stone: e.target.value }))
                    }
                    placeholder="Esmeralda natural / Sin piedra"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Precio (opcional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="1850000"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-300">
                    Disponibilidad
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        status: e.target.value as ProductStatus,
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                  >
                    <option value="available">Disponible</option>
                    <option value="made_to_order">Bajo pedido</option>
                    <option value="sold_out">Agotado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-300">
                  Descripción de la joya
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe acabado, cierre, origen o recomendaciones..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-white focus:border-[var(--gold-primary)] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-zinc-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.show_price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, show_price: e.target.checked }))
                    }
                    className="accent-[var(--gold-primary)]"
                  />
                  Mostrar precio público
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, is_featured: e.target.checked }))
                    }
                    className="accent-[var(--gold-primary)]"
                  />
                  Destacar en catálogo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, is_active: e.target.checked }))
                    }
                    className="accent-[var(--gold-primary)]"
                  />
                  Publicar en tienda
                </label>
              </div>

              {errorMsg ? (
                <p className="rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending || uploading}
                className="flex min-h-[46px] w-full items-center justify-center rounded-xl gold-button text-sm font-bold disabled:opacity-60"
              >
                {isPending ? "Guardando..." : "Guardar Joya"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

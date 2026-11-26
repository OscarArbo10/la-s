"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Product, SiteSettings } from "@/types/database";
import { JewelryCard } from "./JewelryCard";
import { JewelryBottomSheet } from "./JewelryBottomSheet";
import { DiamondFacet } from "./LuxuryOrnaments";

interface CatalogClientProps {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  siteUrl: string;
}

export function CatalogClient({
  products,
  categories,
  settings,
  siteUrl,
}: CatalogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "weight-desc" | "price-asc" | "price-desc">(
    "featured"
  );
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const materials = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.material) unique.add(p.material);
    });
    return Array.from(unique);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = products.filter((p) => {
      if (selectedCategory !== "all" && p.category?.slug !== selectedCategory) {
        return false;
      }
      if (selectedMaterial !== "all" && p.material !== selectedMaterial) {
        return false;
      }
      if (query) {
        const haystack = [
          p.name,
          p.sku,
          p.material,
          p.stone ?? "",
          p.description ?? "",
          p.category?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "weight-desc") {
        return (b.weight_grams ?? 0) - (a.weight_grams ?? 0);
      }
      if (sortBy === "price-asc") {
        return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      }
      if (sortBy === "price-desc") {
        return (b.price ?? -1) - (a.price ?? -1);
      }
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      return 0;
    });
  }, [products, search, selectedCategory, selectedMaterial, sortBy]);

  const isTwoCol = settings.theme_config.cardLayout !== "grid-1";

  const categoryTabs = useMemo(
    () => [{ id: 0, name: "Todas", slug: "all" }, ...categories],
    [categories]
  );

  return (
    <section className="mx-auto w-full max-w-3xl px-3.5 pb-28 sm:px-4">
      {/* Barra de filtros adhesiva */}
      <div className="sticky top-[64px] z-30 -mx-3.5 border-b border-[var(--gold-muted)]/25 bg-[#040405]/95 px-3.5 pb-3 pt-3 backdrop-blur-md sm:-mx-4 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold-primary)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar anillo, oro 18k, diamante..."
              className="h-10 w-full rounded-xl border border-[var(--gold-muted)]/35 bg-[var(--bg-surface)] pl-9 pr-8 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold-primary)] focus:outline-none"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--gold-primary)]" />
            <select
              aria-label="Ordenar joyas"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "featured" | "weight-desc" | "price-asc" | "price-desc"
                )
              }
              className="h-10 appearance-none rounded-xl border border-[var(--gold-muted)]/35 bg-[var(--bg-surface)] pl-8 pr-3 text-xs font-medium text-zinc-200 focus:border-[var(--gold-primary)] focus:outline-none"
            >
              <option value="featured">Destacados</option>
              <option value="weight-desc">Mayor peso (g)</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Píldoras dinámicas con indicador layoutId */}
        <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {categoryTabs.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "text-black"
                    : "border border-[var(--gold-muted)]/30 bg-black/60 text-zinc-300 hover:border-[var(--gold-primary)]/50"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="activeCategoryPill"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[#b58119]"
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-1.5">
                  {active ? <DiamondFacet className="h-3 w-3" /> : null}
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {materials.length > 1 ? (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-[var(--gold-primary)]">
              Material:
            </span>
            <button
              type="button"
              onClick={() => setSelectedMaterial("all")}
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] transition ${
                selectedMaterial === "all"
                  ? "border border-[var(--gold-primary)]/50 bg-[var(--gold-primary)]/20 text-[var(--gold-light)]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Todos
            </button>
            {materials.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => setSelectedMaterial(mat)}
                className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] transition ${
                  selectedMaterial === mat
                    ? "border border-[var(--gold-primary)]/50 bg-[var(--gold-primary)]/20 text-[var(--gold-light)]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Encabezado de sección */}
      <div className="mt-4 mb-3 flex items-center justify-between text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <DiamondFacet className="h-3.5 w-3.5" glow />
          <span>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "pieza exclusiva" : "piezas en colección"}
          </span>
        </span>
        {(selectedCategory !== "all" || selectedMaterial !== "all" || search) ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSelectedMaterial("all");
            }}
            className="text-[var(--gold-primary)] hover:underline"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {filteredProducts.length > 0 ? (
        <div
          className={
            isTwoCol
              ? "grid grid-cols-2 gap-3 sm:gap-4"
              : "grid grid-cols-1 gap-4"
          }
        >
          {filteredProducts.map((product) => (
            <JewelryCard
              key={product.id}
              product={product}
              settings={settings}
              siteUrl={siteUrl}
              compact={isTwoCol}
              onSelect={setActiveProduct}
            />
          ))}
        </div>
      ) : (
        <div className="diamond-card mt-8 rounded-2xl p-8 text-center">
          <DiamondFacet className="mx-auto h-9 w-9" glow />
          <h3 className="mt-3 font-editorial text-xl font-semibold royal-gold-text">
            No encontramos esa joya
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Prueba otro filtro o consúltanos directamente por WhatsApp para fabricarla a tu medida.
          </p>
        </div>
      )}

      <JewelryBottomSheet
        key={activeProduct?.id ?? "empty"}
        product={activeProduct}
        settings={settings}
        siteUrl={siteUrl}
        onClose={() => setActiveProduct(null)}
      />
    </section>
  );
}

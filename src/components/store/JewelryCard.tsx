"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, MessageCircle, Plus, Scale, Gem, Ruler } from "lucide-react";
import type { Product, SiteSettings } from "@/types/database";
import { buildProductWhatsAppUrl, formatPrice, formatWeight } from "@/lib/whatsapp";
import { useInquiryBag } from "./InquiryBagContext";
import { DiamondFacet } from "./LuxuryOrnaments";

const STATUS_LABELS: Record<
  Product["status"],
  { label: string; className: string }
> = {
  available: {
    label: "Disponible",
    className: "border-emerald-500/45 bg-emerald-950/75 text-emerald-300",
  },
  made_to_order: {
    label: "Bajo pedido",
    className:
      "border-[var(--gold-primary)]/45 bg-black/80 text-[var(--gold-light)]",
  },
  sold_out: {
    label: "Agotado",
    className: "border-zinc-700 bg-zinc-900/85 text-zinc-400",
  },
};

interface JewelryCardProps {
  product: Product;
  settings: SiteSettings;
  siteUrl: string;
  compact?: boolean;
  onSelect: (product: Product) => void;
}

export function JewelryCard({
  product,
  settings,
  siteUrl,
  compact = true,
  onSelect,
}: JewelryCardProps) {
  const { hasItem, toggleItem } = useInquiryBag();
  const inBag = hasItem(product.id);
  const coverImage = product.images[0]?.url;
  const statusInfo = STATUS_LABELS[product.status];
  const weight = formatWeight(product.weight_grams);
  const whatsappUrl = buildProductWhatsAppUrl(product, settings, siteUrl);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`diamond-card group flex flex-col overflow-hidden rounded-2xl transition hover:border-[var(--gold-primary)]/60 ${
        product.is_featured ? "gold-shimmer-border" : ""
      }`}
    >
      {/* Imagen 4:5 con marco joyero */}
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-black text-left"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={product.images[0]?.alt || product.name}
            fill
            sizes={compact ? "(max-width: 640px) 50vw, 320px" : "100vw"}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(229,184,59,0.2),rgba(4,4,5,0.96)_70%)] p-4 text-center">
            <div className="relative h-24 w-28 overflow-hidden rounded-2xl border border-[var(--gold-primary)]/35 bg-black shadow-[0_0_24px_-8px_var(--gold-primary)]">
              <Image
                src="/logo-la-s.jpg"
                alt={product.name}
                fill
                sizes="112px"
                className="object-contain p-1"
              />
            </div>
            <span className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--gold-light)]/75">
              {product.sku}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Badges superiores */}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
          {product.is_featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold-primary)]/60 bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-light)] backdrop-blur-sm">
              <DiamondFacet className="h-2.5 w-2.5" glow />
              Real
            </span>
          ) : null}
        </div>

        {/* Botón rápido de bolsa */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            toggleItem(product);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              toggleItem(product);
            }
          }}
          aria-label={inBag ? "Quitar de consulta" : "Agregar a consulta"}
          className={`absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
            inBag
              ? "border-[var(--gold-primary)] bg-[var(--gold-primary)] text-black shadow-[0_0_16px_rgba(229,184,59,0.6)]"
              : "border-[var(--gold-primary)]/35 bg-black/70 text-[var(--gold-light)] hover:border-[var(--gold-primary)]"
          }`}
        >
          {inBag ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      {/* Información técnica y comercial */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-zinc-400">
            <span className="truncate font-semibold text-[var(--gold-primary)]">
              {product.category?.name ?? "Joyería"}
            </span>
            <span className="shrink-0 font-mono text-zinc-500">{product.sku}</span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product)}
            className="mt-1 block w-full text-left"
          >
            <h3 className="font-editorial text-sm sm:text-base font-semibold leading-snug text-[var(--text-primary)] line-clamp-2">
              {product.name}
            </h3>
          </button>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border border-[var(--gold-muted)]/45 bg-black/60 px-1.5 py-0.5 text-[11px] text-[var(--gold-light)]">
              <Gem className="h-3 w-3 text-[var(--gold-primary)] shrink-0" />
              <span className="truncate max-w-[130px]">{product.material}</span>
            </span>

            {weight ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-200">
                <Scale className="h-3 w-3 text-[var(--gold-primary)] shrink-0" />
                {weight}
              </span>
            ) : null}

            {product.dimensions ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-zinc-300">
                <Ruler className="h-3 w-3 text-[var(--gold-primary)] shrink-0" />
                <span className="truncate max-w-[115px]">{product.dimensions}</span>
              </span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="mt-3 border-t border-[var(--gold-muted)]/25 pt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm sm:text-base font-bold royal-gold-text">
              {formatPrice(product.price, product.show_price)}
            </span>
            <Link
              href={`/joya/${product.slug}`}
              className="text-[11px] text-zinc-400 underline-offset-2 hover:text-[var(--gold-light)] hover:underline"
            >
              Ver ficha
            </Link>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-xl gold-button px-3 py-2 text-xs font-bold tracking-wide transition"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>Consultar WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}

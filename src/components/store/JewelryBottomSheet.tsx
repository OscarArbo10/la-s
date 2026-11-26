"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MessageCircle,
  Scale,
  Gem,
  Ruler,
  Sparkles,
  Plus,
  Check,
  ExternalLink,
} from "lucide-react";
import type { Product, SiteSettings } from "@/types/database";
import { buildProductWhatsAppUrl, formatPrice, formatWeight } from "@/lib/whatsapp";
import { useInquiryBag } from "./InquiryBagContext";
import { DiamondFacet, FiligreeDivider } from "./LuxuryOrnaments";

interface JewelryBottomSheetProps {
  product: Product | null;
  settings: SiteSettings;
  siteUrl: string;
  onClose: () => void;
}

export function JewelryBottomSheet({
  product,
  settings,
  siteUrl,
  onClose,
}: JewelryBottomSheetProps) {
  const [activeImage, setActiveImage] = useState(0);
  const { hasItem, toggleItem } = useInquiryBag();

  if (!product) return null;

  const images = product.images ?? [];
  const currentUrl = images[activeImage]?.url ?? images[0]?.url;
  const inBag = hasItem(product.id);
  const weight = formatWeight(product.weight_grams);
  const whatsappUrl = buildProductWhatsAppUrl(product, settings, siteUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="diamond-card relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--gold-muted)]/30 px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[var(--gold-primary)]">
              <DiamondFacet className="h-3.5 w-3.5" glow />
              {product.sku}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-4 pb-6 pt-4 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--gold-muted)]/40 bg-black">
              {currentUrl ? (
                <Image
                  src={currentUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(229,184,59,0.2),transparent_70%)]">
                  <div className="relative h-28 w-36 overflow-hidden rounded-2xl border border-[var(--gold-primary)]/40 bg-black">
                    <Image
                      src="/logo-la-s.jpg"
                      alt={product.name}
                      fill
                      sizes="144px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <span className="mt-2 text-xs text-zinc-500">
                    Fotografía próximamente
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, index) => (
                  <button
                    key={img.url + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${
                      index === activeImage
                        ? "border-[var(--gold-primary)]"
                        : "border-white/10 opacity-60"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gold-primary)]">
                {product.category?.name ?? "Colección Joyería La S"}
              </p>
              <h2 className="mt-1 font-editorial text-2xl font-bold text-[var(--text-primary)]">
                {product.name}
              </h2>
              <p className="mt-1.5 text-xl font-bold royal-gold-text">
                {formatPrice(product.price, product.show_price)}
              </p>
            </div>

            <FiligreeDivider />

            {product.description ? (
              <p className="text-sm leading-relaxed text-zinc-300">
                {product.description}
              </p>
            ) : null}

            <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[var(--gold-muted)]/35 bg-black/50 p-3.5 text-xs">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Gem className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                  Material
                </span>
                <p className="font-semibold text-white">
                  {product.material}
                  {product.purity ? ` (${product.purity})` : ""}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Scale className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                  Peso aprox.
                </span>
                <p className="font-semibold text-white">
                  {weight ?? "Por confirmar"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Ruler className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                  Medidas / Talla
                </span>
                <p className="font-semibold text-white">
                  {product.dimensions || "A medida"}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                  Piedra / Detalle
                </span>
                <p className="font-semibold text-white">
                  {product.stone || "Sin piedra"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl gold-button px-4 py-3 text-sm font-bold"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Consultar esta joya por WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleItem(product)}
                  className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                    inBag
                      ? "border-[var(--gold-primary)] bg-[var(--gold-primary)]/15 text-[var(--gold-light)]"
                      : "border-white/15 bg-white/5 text-zinc-200"
                  }`}
                >
                  {inBag ? (
                    <>
                      <Check className="h-4 w-4" /> En consulta
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Sumar a bolsa
                    </>
                  )}
                </button>

                <Link
                  href={`/joya/${product.slug}`}
                  className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-zinc-200 hover:border-[var(--gold-primary)]/40"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir enlace
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

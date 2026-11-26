"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Crown, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Product, SiteSettings } from "@/types/database";
import { formatPrice, formatWeight } from "@/lib/whatsapp";
import {
  DiamondFacet,
  DiamondSparkles,
  FiligreeDivider,
} from "./LuxuryOrnaments";

interface HeroShowcaseProps {
  settings: SiteSettings;
  featuredProducts: Product[];
}

export function HeroShowcase({
  settings,
  featuredProducts,
}: HeroShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const haloScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const { heroEyebrow, heroTitle, heroSubtitle } = settings.theme_config;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-[var(--gold-muted)]/25 bg-[radial-gradient(ellipse_at_top,rgba(229,184,59,0.16),transparent_62%)] pb-6 pt-5"
    >
      <DiamondSparkles />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center">
        {/* Eyebrow con diamantes */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-primary)]/40 bg-black/75 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-light)] shadow-[0_0_24px_-8px_var(--gold-primary)]"
        >
          <DiamondFacet className="h-3 w-3" glow />
          <span>{heroEyebrow}</span>
          <DiamondFacet className="h-3 w-3" glow />
        </motion.div>

        {/* Emblema Protagonista del Logo Oficial */}
        <motion.div
          style={{ y: logoY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative mt-4 flex items-center justify-center"
        >
          {/* Halo dorado pulsante */}
          <motion.div
            style={{ scale: haloScale }}
            animate={{ opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(229,184,59,0.32)_0%,rgba(229,184,59,0.08)_48%,transparent_72%)] blur-md"
          />

          {/* Aro ornamental giratorio muy sutil */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -inset-2 rounded-full border border-dashed border-[var(--gold-primary)]/35"
          />

          <div className="relative h-44 w-56 sm:h-52 sm:w-64 overflow-hidden rounded-3xl border border-[var(--gold-primary)]/45 bg-black shadow-[0_18px_50px_-14px_rgba(229,184,59,0.5)]">
            <Image
              src="/logo-la-s.jpg"
              alt={settings.store_name}
              fill
              priority
              sizes="(max-width: 640px) 224px, 256px"
              className="object-contain p-1.5"
            />
          </div>
        </motion.div>

        <FiligreeDivider className="mt-5 w-full" />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-3 font-editorial text-2xl sm:text-4xl font-bold tracking-wide royal-gold-text"
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]"
        >
          {heroSubtitle}
        </motion.p>

        {/* Pilares de confianza con estética de alta joyería */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-200">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-muted)]/40 bg-black/60 px-3 py-1">
            <Crown className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
            Oro &amp; Plata Certificada
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-muted)]/40 bg-black/60 px-3 py-1">
            <DiamondFacet className="h-3.5 w-3.5" />
            Piedras &amp; Peso Exacto
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-muted)]/40 bg-black/60 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
            Asesoría WhatsApp
          </span>
        </div>

        {/* Tira horizontal dinámica de Joyas Destacadas */}
        {featuredProducts.length > 0 ? (
          <div className="mt-6 w-full text-left">
            <div className="mb-2.5 flex items-center justify-between px-0.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-light)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                Selección Real
              </span>
              <span className="text-[11px] text-zinc-400">
                Desliza →
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {featuredProducts.map((item) => (
                <a
                  key={item.id}
                  href={`/joya/${item.slug}`}
                  className="diamond-card gold-shimmer-border flex w-60 shrink-0 items-center gap-3 rounded-2xl p-2.5 transition hover:border-[var(--gold-primary)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--gold-muted)]/40 bg-black">
                    <Image
                      src={item.images[0]?.url || "/logo-la-s.jpg"}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className={
                        item.images[0]?.url
                          ? "object-cover"
                          : "object-contain p-1"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-editorial text-xs font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="truncate text-[10px] text-zinc-400">
                      {item.material}
                      {formatWeight(item.weight_grams)
                        ? ` • ${formatWeight(item.weight_grams)}`
                        : ""}
                    </p>
                    <p className="mt-0.5 flex items-center justify-between text-[11px] font-bold text-[var(--gold-light)]">
                      <span>{formatPrice(item.price, item.show_price)}</span>
                      <MessageCircle className="h-3 w-3 text-[var(--gold-primary)]" />
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import type { SiteSettings } from "@/types/database";
import { useInquiryBag } from "./InquiryBagContext";
import { DiamondFacet } from "./LuxuryOrnaments";

export function Header({ settings }: { settings: SiteSettings }) {
  const { items, setIsOpen } = useInquiryBag();
  const promo = settings.theme_config.promoBanner?.trim();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gold-muted)]/30 bg-[#040405]/92 backdrop-blur-md">
      {promo ? (
        <div className="border-b border-[var(--gold-muted)]/30 bg-gradient-to-r from-black via-[var(--gold-primary)]/14 to-black px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-[var(--gold-light)]">
          <span className="inline-flex items-center gap-1.5">
            <DiamondFacet className="h-3 w-3 shrink-0" glow />
            <span className="truncate">{promo}</span>
            <DiamondFacet className="h-3 w-3 shrink-0" glow />
          </span>
        </div>
      ) : null}

      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--gold-primary)]/60 bg-black shadow-[0_0_24px_-6px_var(--gold-primary)] transition group-hover:scale-105">
            <Image
              src="/logo-la-s.jpg"
              alt={settings.store_name}
              fill
              sizes="44px"
              className="object-contain p-0.5"
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-editorial text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold-light)]">
              Joyería
            </span>
            <span className="font-script text-2xl royal-gold-text -mt-0.5">
              La S
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            aria-label="Panel Administrador"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-muted)]/40 bg-black/70 text-zinc-300 transition hover:border-[var(--gold-primary)] hover:text-[var(--gold-light)]"
          >
            <ShieldCheck className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex h-9 items-center gap-1.5 rounded-full border border-[var(--gold-primary)]/50 bg-gradient-to-b from-[#17140d] to-black px-3.5 text-xs font-semibold text-[var(--gold-light)] shadow-[0_0_18px_-8px_var(--gold-primary)] transition hover:border-[var(--gold-primary)]"
          >
            <ShoppingBag className="h-4 w-4 text-[var(--gold-primary)]" />
            <span>Consulta</span>
            {items.length > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold-primary)] px-1 text-[11px] font-bold text-black">
                {items.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}

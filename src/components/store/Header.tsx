"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import type { SiteSettings } from "@/types/database";
import { useInquiryBag } from "./InquiryBagContext";

export function Header({ settings }: { settings: SiteSettings }) {
  const { items, setIsOpen } = useInquiryBag();
  const promo = settings.theme_config.promoBanner?.trim();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--bg-primary)]/90 backdrop-blur-md">
      {promo ? (
        <div className="border-b border-[var(--gold-muted)]/30 bg-gradient-to-r from-black via-[var(--gold-primary)]/12 to-black px-3 py-1.5 text-center text-[11px] font-medium tracking-wide text-[var(--gold-light)]">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[var(--gold-primary)] shrink-0" />
            <span className="truncate">{promo}</span>
          </span>
        </div>
      ) : null}

      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-primary)]/50 bg-[var(--bg-surface)] shadow-[0_0_20px_-6px_var(--gold-primary)]">
            <span className="font-editorial text-xl font-bold gold-gradient-text leading-none">
              S
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-lg font-semibold tracking-wider text-[var(--text-primary)] leading-tight">
              {settings.store_name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-primary)]">
              Alta Joyería
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            aria-label="Panel Administrador"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-[var(--gold-primary)]/40 hover:text-[var(--gold-light)]"
          >
            <ShieldCheck className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex h-9 items-center gap-1.5 rounded-full border border-[var(--gold-primary)]/40 bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--gold-light)] transition hover:border-[var(--gold-primary)]"
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

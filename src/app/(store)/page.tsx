import { Sparkles } from "lucide-react";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/supabase/config";
import { CatalogClient } from "@/components/store/CatalogClient";

export const revalidate = 60;

export default async function StorePage() {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
  ]);

  const siteUrl = getSiteUrl();
  const { heroEyebrow, heroTitle, heroSubtitle } = settings.theme_config;

  return (
    <div className="flex flex-col">
      {/* Hero Compacto Mobile-First */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-5 pt-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-primary)]/35 bg-[var(--bg-surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--gold-light)]">
          <Sparkles className="h-3 w-3 text-[var(--gold-primary)]" />
          <span>{heroEyebrow}</span>
        </div>

        <h1 className="mt-3 font-editorial text-3xl sm:text-4xl font-bold tracking-tight gold-gradient-text">
          {heroTitle}
        </h1>

        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          {heroSubtitle}
        </p>
      </section>

      <CatalogClient
        products={products}
        categories={categories}
        settings={settings}
        siteUrl={siteUrl}
      />
    </div>
  );
}

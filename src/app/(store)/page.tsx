import { getCategories, getProducts, getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/supabase/config";
import { HeroShowcase } from "@/components/store/HeroShowcase";
import { CatalogClient } from "@/components/store/CatalogClient";

export const revalidate = 60;

export default async function StorePage() {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
  ]);

  const siteUrl = getSiteUrl();
  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div className="flex flex-col">
      <HeroShowcase
        settings={settings}
        featuredProducts={featuredProducts}
      />

      <CatalogClient
        products={products}
        categories={categories}
        settings={settings}
        siteUrl={siteUrl}
      />
    </div>
  );
}

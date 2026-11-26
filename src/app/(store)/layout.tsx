import { getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/supabase/config";
import { InquiryBagProvider } from "@/components/store/InquiryBagContext";
import { Header } from "@/components/store/Header";
import { WhatsAppFAB } from "@/components/store/WhatsAppFAB";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();

  return (
    <InquiryBagProvider>
      <div className="flex min-h-screen flex-col">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 bg-black/50 px-4 py-6 text-center text-xs text-zinc-500">
          <p className="font-editorial text-sm text-[var(--gold-light)]">
            {settings.store_name}
          </p>
          <p className="mt-1">
            Catálogo digital móvil • Consultas directas por WhatsApp
          </p>
        </footer>
        <WhatsAppFAB settings={settings} siteUrl={siteUrl} />
      </div>
    </InquiryBagProvider>
  );
}

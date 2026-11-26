import { getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/supabase/config";
import { InquiryBagProvider } from "@/components/store/InquiryBagContext";
import { Header } from "@/components/store/Header";
import { WhatsAppFAB } from "@/components/store/WhatsAppFAB";
import { FiligreeDivider } from "@/components/store/LuxuryOrnaments";

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
        <footer className="border-t border-[var(--gold-muted)]/30 bg-black/75 px-4 py-7 text-center text-xs text-zinc-500">
          <FiligreeDivider className="mb-3" />
          <p className="font-editorial text-sm tracking-widest uppercase royal-gold-text">
            {settings.store_name}
          </p>
          <p className="mt-1">
            Alta Joyería • Catálogo digital móvil &amp; asesoría por WhatsApp
          </p>
        </footer>
        <WhatsAppFAB settings={settings} siteUrl={siteUrl} />
      </div>
    </InquiryBagProvider>
  );
}

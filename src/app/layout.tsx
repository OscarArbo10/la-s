import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import type { CSSProperties } from "react";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-loaded",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-loaded",
});

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.store_name} | Alta Joyería en Negro & Oro`,
      template: `%s | ${settings.store_name}`,
    },
    description: settings.theme_config.heroSubtitle,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const theme = settings.theme_config;

  const themeVars = {
    "--bg-primary": theme.bgPrimary,
    "--bg-surface": theme.bgSurface,
    "--gold-primary": theme.accentGold,
    "--gold-light": theme.accentGoldLight,
    "--gold-muted": theme.accentGoldMuted,
  } as CSSProperties;

  return (
    <html
      lang="es"
      style={themeVars}
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-[var(--gold-primary)] selection:text-black">
        {children}
      </body>
    </html>
  );
}

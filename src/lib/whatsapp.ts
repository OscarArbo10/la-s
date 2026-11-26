import type { Product, SiteSettings } from "@/types/database";

export function formatPrice(price: number | null | undefined, showPrice = true): string {
  if (!showPrice || price === null || price === undefined || Number.isNaN(price)) {
    return "Consultar precio";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function sanitizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function formatWeight(weight: number | null | undefined): string | null {
  if (weight === null || weight === undefined || Number.isNaN(weight)) {
    return null;
  }
  return `${Number(weight).toFixed(weight % 1 === 0 ? 1 : 2)} g`;
}

export function buildProductWhatsAppUrl(
  product: Product,
  settings: SiteSettings,
  siteUrl?: string
): string {
  const phone = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const priceLabel = formatPrice(product.price, product.show_price);
  const weightLabel = formatWeight(product.weight_grams);
  const baseUrl = siteUrl ? siteUrl.replace(/\/+$/, "") : "";
  const productUrl = baseUrl ? `${baseUrl}/joya/${product.slug}` : "";

  const lines = [
    settings.whatsapp_greeting || `Hola ${settings.store_name} ✨, me interesa esta joya:`,
    "",
    `• Joya: ${product.name}`,
    `• Código: ${product.sku}`,
    `• Material: ${product.material}${product.purity ? ` (Ley ${product.purity})` : ""}`,
  ];

  if (weightLabel) lines.push(`• Peso: ${weightLabel}`);
  if (product.dimensions) lines.push(`• Medida: ${product.dimensions}`);
  if (product.stone && product.stone.toLowerCase() !== "sin piedra") {
    lines.push(`• Piedra: ${product.stone}`);
  }
  lines.push(`• Precio ref.: ${priceLabel}`);
  if (productUrl) lines.push(`• Enlace: ${productUrl}`);
  lines.push("", "¿Me confirmas disponibilidad y detalles de entrega?");

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildBagWhatsAppUrl(
  products: Product[],
  settings: SiteSettings,
  siteUrl?: string
): string {
  const phone = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const baseUrl = siteUrl ? siteUrl.replace(/\/+$/, "") : "";

  if (products.length === 0) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(
      `Hola ${settings.store_name} ✨, quisiera recibir asesoría sobre su catálogo.`
    )}`;
  }

  if (products.length === 1) {
    return buildProductWhatsAppUrl(products[0], settings, siteUrl);
  }

  const lines = [
    `Hola ${settings.store_name} ✨, quisiera consultar por estas ${products.length} joyas:`,
    "",
  ];

  products.forEach((product, idx) => {
    const weight = formatWeight(product.weight_grams);
    const price = formatPrice(product.price, product.show_price);
    const details = [product.material, weight, price].filter(Boolean).join(" • ");
    lines.push(`${idx + 1}. ${product.name} (${product.sku}) — ${details}`);
    if (baseUrl) {
      lines.push(`   ${baseUrl}/joya/${product.slug}`);
    }
  });

  lines.push("", "¿Están disponibles?");
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

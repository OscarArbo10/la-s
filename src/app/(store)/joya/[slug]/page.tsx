import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Gem,
  MessageCircle,
  Ruler,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getProductBySlug, getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/supabase/config";
import { buildProductWhatsAppUrl, formatPrice, formatWeight } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Joya no encontrada" };
  }

  const weight = formatWeight(product.weight_grams);
  const description = [
    product.material,
    weight ? `Peso ${weight}` : null,
    product.dimensions,
    product.description,
  ]
    .filter(Boolean)
    .join(" • ");

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const whatsappUrl = buildProductWhatsAppUrl(product, settings, siteUrl);
  const weight = formatWeight(product.weight_grams);

  return (
    <article className="mx-auto w-full max-w-2xl px-4 pb-28 pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-[var(--gold-light)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      {/* Galería principal */}
      <div className="mt-4 space-y-2.5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--gold-muted)]/40 bg-[var(--bg-surface)]">
          {product.images[0]?.url ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(229,184,59,0.2),transparent_68%)] p-6">
              <div className="relative h-44 w-52 overflow-hidden rounded-3xl border border-[var(--gold-primary)]/45 bg-black shadow-[0_0_30px_-10px_var(--gold-primary)]">
                <Image
                  src="/logo-la-s.jpg"
                  alt={product.name}
                  fill
                  sizes="208px"
                  className="object-contain p-2"
                />
              </div>
              <span className="mt-3 font-mono text-xs tracking-widest text-[var(--gold-light)]/75">
                {product.sku}
              </span>
            </div>
          )}
        </div>

        {product.images.length > 1 ? (
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1, 5).map((img, i) => (
              <div
                key={img.url + i}
                className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${product.name} vista ${i + 2}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Datos principales */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest">
          <span className="text-[var(--gold-primary)]">
            {product.category?.name ?? "Joyería La S"}
          </span>
          <span className="font-mono text-zinc-500">Ref: {product.sku}</span>
        </div>

        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">
            {product.name}
          </h1>
          <p className="mt-2 text-2xl font-bold text-[var(--gold-light)]">
            {formatPrice(product.price, product.show_price)}
          </p>
        </div>

        {product.description ? (
          <p className="text-sm leading-relaxed text-zinc-300">
            {product.description}
          </p>
        ) : null}

        {/* Especificaciones técnicas */}
        <div className="rounded-2xl border border-[var(--gold-muted)]/35 bg-[var(--bg-surface)] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--gold-primary)]">
            Especificaciones de la pieza
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="flex items-center gap-1 text-xs text-zinc-400">
                <Gem className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                Material
              </dt>
              <dd className="mt-0.5 font-semibold text-white">
                {product.material}
                {product.purity ? ` (Ley ${product.purity})` : ""}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-1 text-xs text-zinc-400">
                <Scale className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                Peso
              </dt>
              <dd className="mt-0.5 font-semibold text-white">
                {weight ?? "Por confirmar"}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-1 text-xs text-zinc-400">
                <Ruler className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                Medidas / Talla
              </dt>
              <dd className="mt-0.5 font-semibold text-white">
                {product.dimensions || "A medida"}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-1 text-xs text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
                Piedra
              </dt>
              <dd className="mt-0.5 font-semibold text-white">
                {product.stone || "Sin piedra"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-zinc-300">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--gold-primary)]" />
          <span>
            Garantía de autenticidad en material y peso. Confirmamos disponibilidad en tiempo real por WhatsApp.
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl gold-button px-5 text-sm font-bold"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>
    </article>
  );
}

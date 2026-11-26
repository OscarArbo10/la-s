import Link from "next/link";
import { Gem, Palette, Plus, Star, Tags, CheckCircle2, AlertCircle } from "lucide-react";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data";

export default async function AdminDashboardPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(true),
    getCategories(true),
    getSiteSettings(),
  ]);

  const activeCount = products.filter((p) => p.is_active).length;
  const featuredCount = products.filter((p) => p.is_featured).length;
  const soldOutCount = products.filter((p) => p.status === "sold_out").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-primary)]">
          Resumen del Catálogo
        </p>
        <h1 className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-white">
          Bienvenido, {settings.store_name}
        </h1>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs">Total Joyas</span>
            <Gem className="h-4 w-4 text-[var(--gold-primary)]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{products.length}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs">Publicadas</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{activeCount}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs">Destacadas</span>
            <Star className="h-4 w-4 text-[var(--gold-light)]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{featuredCount}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs">Agotadas</span>
            <AlertCircle className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{soldOutCount}</p>
        </div>
      </div>

      {/* Accesos rápidos pensados para celular */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/productos?new=1"
          className="flex items-center justify-between rounded-2xl border border-[var(--gold-primary)]/40 bg-gradient-to-br from-[var(--gold-primary)]/15 to-[var(--bg-surface)] p-4 transition hover:border-[var(--gold-primary)]"
        >
          <div>
            <p className="font-semibold text-[var(--gold-light)]">
              Agregar nueva joya
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Sube foto desde cámara, peso y material
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full gold-button">
            <Plus className="h-5 w-5" />
          </span>
        </Link>

        <Link
          href="/admin/categorias"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4 transition hover:border-[var(--gold-primary)]/40"
        >
          <div>
            <p className="font-semibold text-white">Categorías</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              {categories.length} categorías configuradas
            </p>
          </div>
          <Tags className="h-5 w-5 text-[var(--gold-primary)]" />
        </Link>

        <Link
          href="/admin/apariencia"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4 transition hover:border-[var(--gold-primary)]/40"
        >
          <div>
            <p className="font-semibold text-white">Estilos y WhatsApp</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Cambia tonos dorados, banner y número
            </p>
          </div>
          <Palette className="h-5 w-5 text-[var(--gold-primary)]" />
        </Link>
      </div>
    </div>
  );
}

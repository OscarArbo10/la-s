"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  Tags,
  Palette,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { signOutAdminAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Joyas", icon: Gem },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/apariencia", label: "Estilos", icon: Palette },
];

export function AdminNav({ storeName }: { storeName: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--gold-primary)]/55 bg-black">
              <Image
                src="/logo-la-s.jpg"
                alt={storeName}
                fill
                sizes="36px"
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">
                Admin • {storeName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 text-xs text-zinc-200 hover:border-[var(--gold-primary)]/50"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[var(--gold-primary)]" />
              <span className="hidden sm:inline">Ver tienda</span>
            </Link>

            <form action={signOutAdminAction}>
              <button
                type="submit"
                aria-label="Cerrar sesión"
                className="inline-flex h-8 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 text-xs text-zinc-300 hover:border-red-500/40 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Navegación inferior fija para móvil + centrada en desktop */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-xl grid-cols-4 px-2 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition ${
                  active
                    ? "text-[var(--gold-light)] bg-[var(--gold-primary)]/12"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-[var(--gold-primary)]" : ""
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

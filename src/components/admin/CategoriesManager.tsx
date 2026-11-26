"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { slugify } from "@/lib/image-compress";
import {
  deleteCategoryAction,
  upsertCategoryAction,
} from "@/app/admin/actions";
import type { Category } from "@/types/database";

export function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [order, setOrder] = useState("1");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setErrorMsg(null);

    startTransition(async () => {
      const res = await upsertCategoryAction({
        name,
        slug: slugify(name),
        display_order: Number(order) || 0,
        is_active: true,
      });
      if (!res.ok) {
        setErrorMsg(res.error ?? "No se pudo crear la categoría.");
        return;
      }
      setName("");
      router.refresh();
    });
  }

  function handleToggle(cat: Category) {
    startTransition(async () => {
      await upsertCategoryAction({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        display_order: cat.display_order,
        is_active: !cat.is_active,
      });
      router.refresh();
    });
  }

  function handleDelete(cat: Category) {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    startTransition(async () => {
      await deleteCategoryAction(cat.id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-white">
          Categorías del Catálogo
        </h1>
        <p className="text-xs text-zinc-400">
          Organiza las píldoras de navegación superior en la tienda móvil
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4 sm:flex-row"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (ej. Esmeraldas, Relojes)"
          className="h-10 flex-1 rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold-primary)] focus:outline-none"
        />
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="Orden"
          className="h-10 w-full sm:w-24 rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl gold-button px-4 text-xs font-bold"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </form>

      {errorMsg ? (
        <p className="rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
          {errorMsg}
        </p>
      ) : null}

      <div className="space-y-2">
        {initialCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--bg-surface)] px-4 py-3"
          >
            <div>
              <p className="font-semibold text-white">{cat.name}</p>
              <p className="text-xs text-zinc-400">
                /{cat.slug} • Orden: {cat.display_order}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(cat)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs ${
                  cat.is_active
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400"
                }`}
              >
                {cat.is_active ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Activa
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Oculta
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(cat)}
                aria-label={`Eliminar ${cat.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:border-red-500/40 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

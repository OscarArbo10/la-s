"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, AlertTriangle } from "lucide-react";
import { signInAdminAction } from "@/app/admin/actions";

export function LoginForm({ supabaseReady }: { supabaseReady: boolean }) {
  const [state, formAction, isPending] = useActionState(signInAdminAction, {
    error: null,
  });

  return (
    <div className="w-full max-w-sm rounded-3xl border border-[var(--gold-muted)]/40 bg-[var(--bg-surface)] p-6 shadow-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--gold-primary)]/50 bg-black">
          <span className="font-editorial text-3xl font-bold gold-gradient-text">
            S
          </span>
        </div>
        <h1 className="mt-3 font-editorial text-2xl font-bold text-white">
          Panel Joyería La S
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Acceso exclusivo para administración de catálogo y estilos
        </p>
      </div>

      {!supabaseReady ? (
        <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Modo demostración activo</span>
          </div>
          <p className="leading-relaxed text-amber-100/80">
            Para activar el panel administrador, configura{" "}
            <code className="rounded bg-black/50 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            y{" "}
            <code className="rounded bg-black/50 px-1 py-0.5">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            </code>{" "}
            en <code className="rounded bg-black/50 px-1 py-0.5">.env.local</code> y ejecuta la migración SQL.
          </p>
        </div>
      ) : null}

      <form action={formAction} className="mt-5 space-y-3.5">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@joyerialas.com"
            className="h-11 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-white/15 bg-black/60 px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--gold-primary)] focus:outline-none"
          />
        </div>

        {state.error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl gold-button text-sm font-bold disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          <span>{isPending ? "Verificando..." : "Entrar al Panel"}</span>
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[var(--gold-light)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al catálogo público
        </Link>
      </div>
    </div>
  );
}

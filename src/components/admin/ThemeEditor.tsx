"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { THEME_PRESETS } from "@/lib/demo-data";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import type { CardLayout, SiteSettings, ThemePresetId } from "@/types/database";

export function ThemeEditor({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [storeName, setStoreName] = useState(initialSettings.store_name);
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSettings.whatsapp_number
  );
  const [whatsappGreeting, setWhatsappGreeting] = useState(
    initialSettings.whatsapp_greeting
  );
  const [theme, setTheme] = useState(initialSettings.theme_config);
  const [feedback, setFeedback] = useState<string | null>(null);

  function applyPreset(presetId: ThemePresetId) {
    const preset = THEME_PRESETS[presetId];
    setTheme((prev) => ({
      ...prev,
      preset: preset.id,
      accentGold: preset.accentGold,
      accentGoldLight: preset.accentGoldLight,
      accentGoldMuted: preset.accentGoldMuted,
      bgPrimary: preset.bgPrimary,
      bgSurface: preset.bgSurface,
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const res = await updateSiteSettingsAction({
        store_name: storeName,
        whatsapp_number: whatsappNumber,
        whatsapp_greeting: whatsappGreeting,
        theme_config: theme,
      });

      if (!res.ok) {
        setFeedback(`Error: ${res.error}`);
        return;
      }

      setFeedback("Estilos y configuración actualizados en toda la tienda.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="font-editorial text-2xl font-bold text-white">
          Estilos Dinámicos & WhatsApp
        </h1>
        <p className="text-xs text-zinc-400">
          Personaliza la paleta negro/dorado, distribución móvil y número de atención
        </p>
      </div>

      {/* Vista previa en vivo */}
      <div
        style={{
          backgroundColor: theme.bgPrimary,
          borderColor: theme.accentGoldMuted,
        }}
        className="rounded-3xl border p-4"
      >
        <p
          style={{ color: theme.accentGold }}
          className="text-[10px] uppercase tracking-[0.2em]"
        >
          Vista previa en vivo • {theme.heroEyebrow}
        </p>
        <h2
          style={{ color: theme.accentGoldLight }}
          className="mt-1 font-editorial text-xl font-bold"
        >
          {theme.heroTitle}
        </h2>
        <div
          style={{ backgroundColor: theme.bgSurface }}
          className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 p-3"
        >
          <div>
            <p className="text-xs font-semibold text-white">
              Anillo Solitario 18k
            </p>
            <p className="text-[11px] text-zinc-400">Oro 18k • 4.2 g</p>
          </div>
          <span
            style={{ backgroundColor: theme.accentGold }}
            className="rounded-xl px-3 py-1.5 text-[11px] font-bold text-black"
          >
            Consultar
          </span>
        </div>
      </div>

      {/* Presets de color dinámico */}
      <section className="space-y-2.5 rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-primary)]">
          Paleta Dinámica (Negro & Oro)
        </h2>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {Object.values(THEME_PRESETS).map((preset) => {
            const selected = theme.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`flex flex-col items-start rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-[var(--gold-primary)] bg-black/70"
                    : "border-white/10 bg-black/30 hover:border-white/25"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: preset.bgPrimary }}
                      className="h-4 w-4 rounded-full border border-white/20"
                    />
                    <span
                      style={{ backgroundColor: preset.accentGold }}
                      className="h-4 w-4 rounded-full"
                    />
                  </div>
                  {selected ? (
                    <Check className="h-4 w-4 text-[var(--gold-primary)]" />
                  ) : null}
                </div>
                <p className="mt-2 text-xs font-semibold text-white">
                  {preset.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Ajuste fino de diseño móvil */}
        <div className="pt-2">
          <label className="mb-1.5 block text-xs text-zinc-300">
            Diseño de tarjetas en celular
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "grid-2", label: "2 Columnas (Catálogo denso)" },
                { id: "grid-1", label: "1 Columna (Editorial grande)" },
              ] as { id: CardLayout; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setTheme((prev) => ({ ...prev, cardLayout: opt.id }))
                }
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                  theme.cardLayout === opt.id
                    ? "border-[var(--gold-primary)] bg-[var(--gold-primary)]/15 text-[var(--gold-light)]"
                    : "border-white/10 bg-black/40 text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Textos y WhatsApp */}
      <section className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-surface)] p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-primary)]">
          Marca, Textos y WhatsApp
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-300">
              Nombre de la joyería
            </label>
            <input
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-300">
              WhatsApp (código país + número, sin +)
            </label>
            <input
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="573001234567"
              className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 font-mono text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-300">
            Saludo inicial de WhatsApp
          </label>
          <input
            value={whatsappGreeting}
            onChange={(e) => setWhatsappGreeting(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-300">
            Banner superior promocional (opcional)
          </label>
          <input
            value={theme.promoBanner}
            onChange={(e) =>
              setTheme((prev) => ({ ...prev, promoBanner: e.target.value }))
            }
            placeholder="Envíos asegurados a todo el país"
            className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-300">
              Etiqueta superior Hero
            </label>
            <input
              value={theme.heroEyebrow}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, heroEyebrow: e.target.value }))
              }
              className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-300">
              Título principal Hero
            </label>
            <input
              value={theme.heroTitle}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, heroTitle: e.target.value }))
              }
              className="h-10 w-full rounded-xl border border-white/15 bg-black/60 px-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-zinc-300">
            Subtítulo Hero
          </label>
          <textarea
            rows={2}
            value={theme.heroSubtitle}
            onChange={(e) =>
              setTheme((prev) => ({ ...prev, heroSubtitle: e.target.value }))
            }
            className="w-full rounded-xl border border-white/15 bg-black/60 p-3 text-sm text-white focus:border-[var(--gold-primary)] focus:outline-none"
          />
        </div>
      </section>

      {feedback ? (
        <p className="rounded-xl border border-[var(--gold-primary)]/40 bg-[var(--gold-primary)]/10 px-3.5 py-2.5 text-xs text-[var(--gold-light)]">
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl gold-button text-sm font-bold disabled:opacity-60"
      >
        <Sparkles className="h-4 w-4" />
        <span>{isPending ? "Guardando estilos..." : "Aplicar cambios"}</span>
      </button>
    </form>
  );
}

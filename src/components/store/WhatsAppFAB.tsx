"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import type { SiteSettings } from "@/types/database";
import { buildBagWhatsAppUrl, formatPrice, formatWeight } from "@/lib/whatsapp";
import { useInquiryBag } from "./InquiryBagContext";

export function WhatsAppFAB({
  settings,
  siteUrl,
}: {
  settings: SiteSettings;
  siteUrl: string;
}) {
  const { items, isOpen, setIsOpen, removeItem, clearBag } = useInquiryBag();
  const bagWhatsAppUrl = buildBagWhatsAppUrl(items, settings, siteUrl);

  return (
    <>
      {/* Botón flotante móvil inferior derecho */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-12 items-center gap-2 rounded-full gold-button px-4 text-xs font-bold shadow-xl"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Consultar ({items.length})</span>
          </button>
        ) : (
          <a
            href={bagWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Asesoría por WhatsApp"
            className="flex h-12 items-center gap-2 rounded-full gold-button px-4 text-xs font-bold shadow-xl"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>

      {/* Drawer de Bolsa de Consulta */}
      <AnimatePresence>
        {isOpen ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl border border-[var(--gold-muted)]/40 bg-[var(--bg-surface)] p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-white">
                    Bolsa de Consulta
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Envía todas tus piezas seleccionadas en un solo mensaje
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-3 flex-1 space-y-2.5 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-zinc-400">
                    Aún no has agregado joyas. Toca el botón &quot;+&quot; en cualquier tarjeta para sumar piezas o escribe directo por WhatsApp.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item.sku} • {item.material}
                          {formatWeight(item.weight_grams)
                            ? ` • ${formatWeight(item.weight_grams)}`
                            : ""}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-[var(--gold-light)]">
                          {formatPrice(item.price, item.show_price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Quitar ${item.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-3">
                <a
                  href={bagWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl gold-button px-4 text-sm font-bold"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>
                    {items.length > 0
                      ? `Consultar ${items.length} ${items.length === 1 ? "joya" : "joyas"} por WhatsApp`
                      : "Chatear por WhatsApp"}
                  </span>
                </a>

                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearBag}
                    className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Vaciar lista
                  </button>
                ) : null}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

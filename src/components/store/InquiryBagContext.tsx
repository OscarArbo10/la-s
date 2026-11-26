"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Product } from "@/types/database";

interface InquiryBagContextValue {
  items: Product[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  hasItem: (productId: number) => boolean;
  clearBag: () => void;
}

const InquiryBagContext = createContext<InquiryBagContextValue | null>(null);
const STORAGE_KEY = "joyeria-la-s-inquiry-bag";
const BAG_EVENT = "joyeria-la-s-bag-change";
const EMPTY_ITEMS: Product[] = [];

let cachedRaw: string | null = null;
let cachedItems: Product[] = EMPTY_ITEMS;

function getSnapshot(): Product[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    if (!raw) {
      cachedItems = EMPTY_ITEMS;
      return cachedItems;
    }
    const parsed = JSON.parse(raw);
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
    return cachedItems;
  } catch {
    return EMPTY_ITEMS;
  }
}

function getServerSnapshot(): Product[] {
  return EMPTY_ITEMS;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(BAG_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(BAG_EVENT, callback);
  };
}

function writeBag(next: Product[]) {
  try {
    const raw = JSON.stringify(next);
    cachedRaw = raw;
    cachedItems = next;
    window.localStorage.setItem(STORAGE_KEY, raw);
    window.dispatchEvent(new Event(BAG_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function InquiryBagProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<InquiryBagContextValue>(
    () => ({
      items,
      isOpen,
      setIsOpen,
      addItem: (product) => {
        const current = getSnapshot();
        if (!current.some((p) => p.id === product.id)) {
          writeBag([...current, product]);
        }
      },
      removeItem: (productId) => {
        const current = getSnapshot();
        writeBag(current.filter((p) => p.id !== productId));
      },
      toggleItem: (product) => {
        const current = getSnapshot();
        const exists = current.some((p) => p.id === product.id);
        writeBag(
          exists
            ? current.filter((p) => p.id !== product.id)
            : [...current, product]
        );
      },
      hasItem: (productId) => items.some((p) => p.id === productId),
      clearBag: () => writeBag(EMPTY_ITEMS),
    }),
    [items, isOpen]
  );

  return (
    <InquiryBagContext.Provider value={value}>
      {children}
    </InquiryBagContext.Provider>
  );
}

export function useInquiryBag() {
  const ctx = useContext(InquiryBagContext);
  if (!ctx) {
    throw new Error("useInquiryBag must be used inside InquiryBagProvider");
  }
  return ctx;
}

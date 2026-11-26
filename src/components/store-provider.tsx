"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  size: string;
  color: string;
  qty: number;
};

export type WishlistItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
};

type Toast = { id: number; message: string };

type StoreContextType = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  setQty: (id: number, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  toast: (message: string) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("mm_cart");
      const w = localStorage.getItem("mm_wishlist");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("mm_cart", JSON.stringify(cart));
      localStorage.setItem("mm_wishlist", JSON.stringify(wishlist));
    } catch {
      /* storage full */
    }
  }, [cart, wishlist, hydrated]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "qty">, qty: number = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 99) };
          return next;
        }
        return [...prev, { ...item, qty }];
      });
      toast("به سبد خرید اضافه شد");
    },
    [toast]
  );

  const removeFromCart = useCallback((id: number, size: string, color: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size && i.color === color)));
  }, []);

  const setQty = useCallback(
    (id: number, size: string, color: string, qty: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.id === id && i.size === size && i.color === color
              ? { ...i, qty: Math.max(0, Math.min(99, qty)) }
              : i
          )
          .filter((i) => i.qty > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      setWishlist((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        toast(exists ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد");
        return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
      });
    },
    [toast]
  );

  const isInWishlist = useCallback((id: number) => wishlist.some((i) => i.id === id), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (s, i) => s + (i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price) * i.qty,
        0
      ),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      cartTotal,
      hydrated,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      toast,
    }),
    [cart, wishlist, cartCount, cartTotal, hydrated, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, isInWishlist, toast]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      {/* Toasts */}
      <div className="fixed bottom-6 left-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-xl bg-slate-900/95 backdrop-blur px-4 py-2.5 text-sm font-medium text-white shadow-xl shadow-slate-900/20 animate-[toastIn_.25s_ease]"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="p-0.5 rounded hover:bg-white/10 transition"
              aria-label="بستن"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

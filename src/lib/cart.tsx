import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById, type Product } from "./products";

export type CartItem = { id: string; qty: number };

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  detailed: { product: Product; qty: number }[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => ({ product: getProductById(i.id)!, qty: i.qty }))
      .filter((x) => x.product);

    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: detailed.reduce((s, x) => s + x.product.price * x.qty, 0),
      detailed,
      add: (id, qty = 1) =>
        setItems((p) => {
          const e = p.find((i) => i.id === id);
          return e
            ? p.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
            : [...p, { id, qty }];
        }),
      setQty: (id, qty) =>
        setItems((p) =>
          qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => (i.id === id ? { ...i, qty } : i))
        ),
      remove: (id) => setItems((p) => p.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}

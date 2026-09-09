import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { products as ALL_PRODUCTS, Product } from "@/data/products";
import { toast } from "sonner";

type CartItem = { product: Product; qty: number };

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const Ctx = createContext<StoreCtx | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("devora_cart");
      if (!raw) return [];
      const ids: { id: string; qty: number }[] = JSON.parse(raw);
      return ids
        .map(({ id, qty }) => {
          const p = ALL_PRODUCTS.find((x) => x.id === id);
          return p ? { product: p, qty } : null;
        })
        .filter(Boolean) as CartItem[];
    } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("devora_wishlist") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("devora_cart", JSON.stringify(cart.map((c) => ({ id: c.product.id, qty: c.qty }))));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("devora_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (id: string, qty = 1) => {
    const p = ALL_PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    setCart((prev) => {
      const found = prev.find((c) => c.product.id === id);
      if (found) return prev.map((c) => c.product.id === id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { product: p, qty }];
    });
    toast.success(`${p.name} added to cart`);
  };
  const removeFromCart = (id: string) => setCart((p) => p.filter((c) => c.product.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((p) => p.map((c) => c.product.id === id ? { ...c, qty } : c));
  };
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) { toast("Removed from wishlist"); return prev.filter((x) => x !== id); }
      toast.success("Added to wishlist");
      return [...prev, id];
    });
  };
  const isWished = (id: string) => wishlist.includes(id);
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <Ctx.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, toggleWishlist, isWished, clearCart, cartTotal, cartCount }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
};

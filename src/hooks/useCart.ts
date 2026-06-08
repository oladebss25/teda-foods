import { useState, useCallback } from 'react';

export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export type Cart = Record<string, CartItem>;

export function useCart() {
  const [cart, setCart] = useState<Cart>({});

  const toggleItem = useCallback((id: string, name: string, price: number) => {
    setCart((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { name, price, qty: 1 } };
    });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const newQty = prev[id].qty + delta;
      if (newQty < 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...prev[id], qty: newQty } };
    });
  }, []);

  const getTotal = useCallback(() => {
    return Object.values(cart).reduce((sum: number, item: CartItem) => sum + item.price * item.qty, 0);
  }, [cart]);

  const getCount = useCallback(() => Object.keys(cart).length, [cart]);

  const getSummary = useCallback(() => {
    let lines = '';
    Object.values(cart).forEach((item: CartItem) => {
      const sub = item.price * item.qty;
      lines += '• ' + item.name + ' x' + item.qty + ' = ₦' + sub.toLocaleString() + '\n';
    });
    return lines;
  }, [cart]);

  const clearCart = useCallback(() => setCart({}), []);

  return { cart, toggleItem, changeQty, getTotal, getCount, getSummary, clearCart };
}

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CatalogProduct } from "../data/products";

export interface CartItem {
  id: string;
  brandName: string;
  genericComposition: string;
  unitPriceINR: number;
  quantity: number;
  prescriptionRequired: boolean;
  cdscoCategory: string;
  packSize: string;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CatalogProduct) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotalINR: number;
  cgstINR: number;
  sgstINR: number;
  totalAmountINR: number;
  hasPrescriptionRestrictedItem: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: CatalogProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          brandName: product.brandName,
          genericComposition: product.genericComposition,
          unitPriceINR: product.sellingPriceINR,
          quantity: 1,
          prescriptionRequired: product.prescriptionRequired,
          cdscoCategory: product.cdscoCategory,
          packSize: product.packSize,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalINR = items.reduce(
    (sum, item) => sum + item.unitPriceINR * item.quantity,
    0
  );
  const cgstINR = Math.round(subtotalINR * 0.06 * 100) / 100;
  const sgstINR = Math.round(subtotalINR * 0.06 * 100) / 100;
  const totalAmountINR = Math.round((subtotalINR + cgstINR + sgstINR) * 100) / 100;

  const hasPrescriptionRestrictedItem = items.some((i) => i.prescriptionRequired);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotalINR,
        cgstINR,
        sgstINR,
        totalAmountINR,
        hasPrescriptionRestrictedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

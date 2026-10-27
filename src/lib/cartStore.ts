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

const CART_STORAGE_KEY = "drgodly_pharmacy_cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("drgodly_cart_updated"));
  } catch (err) {
    console.error("Failed to persist cart items", err);
  }
}

export function addToCart(item: Omit<CartItem, "quantity">): void {
  const current = getCartItems();
  const existingIdx = current.findIndex((i) => i.id === item.id);
  if (existingIdx > -1) {
    current[existingIdx].quantity += 1;
  } else {
    current.push({ ...item, quantity: 1 });
  }
  saveCartItems(current);
}

export function updateCartQuantity(id: string, delta: number): void {
  const current = getCartItems();
  const item = current.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    const filtered = current.filter((i) => i.id !== id);
    saveCartItems(filtered);
  } else {
    saveCartItems(current);
  }
}

export function removeFromCart(id: string): void {
  const current = getCartItems();
  const filtered = current.filter((i) => i.id !== id);
  saveCartItems(filtered);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event("drgodly_cart_updated"));
}

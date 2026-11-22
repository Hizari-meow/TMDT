'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl?: string;
  categoryName?: string;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  selectedItemIds: string[];
  toggleSelectItem: (productId: string) => void;
  selectAllItems: () => void;
  unselectAllItems: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  pointsDiscount: number;
  usePoints: boolean;
  setUsePoints: (use: boolean) => void;
  shippingFee: number;
  totalAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('techzone_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        setSelectedItemIds(parsed.map((i: CartItem) => i.productId));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('techzone_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const toggleSelectItem = (productId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const selectAllItems = () => {
    setSelectedItemIds(items.map((i) => i.productId));
  };

  const unselectAllItems = () => {
    setSelectedItemIds([]);
  };

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = item.quantity || 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setSelectedItemIds((prev) => (prev.includes(item.productId) ? prev : [...prev, item.productId]));
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    setSelectedItemIds((prev) => prev.filter((id) => id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedItemIds([]);
    setAppliedCoupon(null);
    setUsePoints(false);
  };

  // Only calculate for checked/selected items
  const activeItems = items.filter((i) => selectedItemIds.includes(i.productId));
  const totalItems = activeItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = activeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Coupon discount calculation
  let discount = 0;
  if (appliedCoupon === 'TECHZONE50') {
    discount = 50; // $50 off
  } else if (appliedCoupon === 'APPLE10') {
    discount = subtotal * 0.1; // 10% off
  }

  // Points discount: 500 TechZone xu = $5.00
  const pointsDiscount = usePoints && subtotal > 10 ? 5 : 0;

  // Free shipping if subtotal >= $100 or coupon FREESHIP
  const shippingFee = subtotal >= 100 || appliedCoupon === 'FREESHIP' || subtotal === 0 ? 0 : 15;
  const totalAmount = Math.max(0, subtotal - discount - pointsDiscount + shippingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TECHZONE50') {
      setAppliedCoupon('TECHZONE50');
      return { success: true, message: 'Đã áp dụng mã giảm giá $50 cho đơn hàng!' };
    }
    if (cleanCode === 'APPLE10') {
      setAppliedCoupon('APPLE10');
      return { success: true, message: 'Đã áp dụng giảm 10% tổng đơn hàng!' };
    }
    if (cleanCode === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      return { success: true, message: 'Miễn phí vận chuyển toàn quốc!' };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItemIds,
        toggleSelectItem,
        selectAllItems,
        unselectAllItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discount,
        pointsDiscount,
        usePoints,
        setUsePoints,
        shippingFee,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

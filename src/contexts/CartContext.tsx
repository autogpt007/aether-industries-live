
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export interface CartProduct {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  dataAiHint: string;
  price: number | null;
  isQuoteItem: boolean;
  requiresCertification: boolean;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartSubtotal: () => number;
  isItemInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aetherIndustriesCart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const previousUserUidRef = useRef<string | null | undefined>(undefined);

  // Effect to load cart from localStorage on initial mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      setCartItems([]); // Reset to empty on error
    }
  }, []); // Empty dependency array: run only once on mount

  // Effect to save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  // Effect to clear cart when the authenticated user changes
  useEffect(() => {
    if (isMounted && !authLoading) {
      const currentUid = user?.uid;
      // If the user ID has changed (login, logout, or different user)
      if (previousUserUidRef.current !== currentUid) {
        console.log('[CartContext] User authentication state changed. Clearing cart.');
        setCartItems([]); // Clear in-memory cart, which will trigger save to localStorage
      }
      previousUserUidRef.current = currentUid;
    }
  }, [user?.uid, isMounted, authLoading]);


  const addToCart = useCallback((product: CartProduct, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.productId === product.productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.productId !== productId));
  }, []);

  const updateItemQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      if (item.price !== null && !item.isQuoteItem) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems]);

  const isItemInCart = useCallback((productId: string) => {
    return cartItems.some(item => item.productId === productId);
  }, [cartItems]);

  if (!isMounted) {
    // While not mounted, you can return null or a loading spinner.
    return null; 
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getItemCount,
        getCartSubtotal,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product, CartItem, Category, Order, StoreSettings, HeroSettings, FeatureItem, Testimonial, ThemeMode } from '../types';
import { initialProducts, initialCategories, initialSettings, initialHeroSettings, initialFeatures, initialTestimonials } from '../data/products';
import {
  loadAllFromSupabase,
  saveProductsToSupabase,
  saveCategoriesToSupabase,
  saveOrdersToSupabase, updateOrderStatusInSupabase,
  saveSettingsToSupabase, saveHeroToSupabase,
  saveFeaturesToSupabase, saveTestimonialsToSupabase,
} from '../utils/supabaseData';

// ═══════════════════════════════════════════════════════════
//  localStorage helpers — ONLY for cart & theme (user-local)
// ═══════════════════════════════════════════════════════════

function loadLocal<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveLocal<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* */ }
}

// ═══════════════════════════════════════════════════════════
//  Context shape
// ═══════════════════════════════════════════════════════════

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  heroSettings: HeroSettings;
  setHeroSettings: React.Dispatch<React.SetStateAction<HeroSettings>>;
  features: FeatureItem[];
  setFeatures: React.Dispatch<React.SetStateAction<FeatureItem[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  showAdminLogin: boolean;
  setShowAdminLogin: (show: boolean) => void;
  logoClickCount: number;
  handleLogoClick: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  adminPassword: string;
  setAdminPassword: (pw: string) => void;
  verifyAdminPassword: (pw: string) => boolean;
  supabaseLoaded: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════
//  Provider
// ═══════════════════════════════════════════════════════════

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // ── State (seeded from hardcoded defaults until Supabase loads) ──
  const [products, setProducts]       = useState<Product[]>(initialProducts);
  const [categories, setCategories]   = useState<Category[]>(initialCategories);
  const [orders, setOrders]           = useState<Order[]>([]);
  const [settings, setSettings]       = useState<StoreSettings>(initialSettings);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialHeroSettings);
  const [features, setFeatures]       = useState<FeatureItem[]>(initialFeatures);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // ── User-local state (localStorage only, NOT in Supabase) ──────
  const [cart, setCart]               = useState<CartItem[]>(() => loadLocal('kadishop_cart', []));
  const [theme, setTheme]             = useState<ThemeMode>(() => loadLocal('kadishop_theme', 'dark'));

  // ── UI state ────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart]       = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [supabaseLoaded, setSupabaseLoaded] = useState(false);

  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adminPassword = settings.adminPassword || '90809080';

  // ── Load from Supabase on mount ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    loadAllFromSupabase()
      .then(data => {
        if (cancelled) return;
        if (data.products.length)    setProducts(data.products);
        if (data.categories.length)  setCategories(data.categories);
        if (data.orders.length)      setOrders(data.orders);
        if (data.settings)           setSettings(data.settings);
        if (data.heroSettings)       setHeroSettings(data.heroSettings);
        if (data.features.length)    setFeatures(data.features);
        if (data.testimonials.length) setTestimonials(data.testimonials);
        setSupabaseLoaded(true);
        console.log('[Store] Supabase data loaded');
      })
      .catch(err => {
        console.error('[Store] Supabase load failed, using defaults:', err);
        setSupabaseLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Persist user-local state to localStorage ────────────────────
  useEffect(() => { saveLocal('kadishop_cart', cart); }, [cart]);
  useEffect(() => { saveLocal('kadishop_theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  // ── Sync state changes → Supabase ───────────────────────────────
  useEffect(() => {
    if (!supabaseLoaded) return;
    saveProductsToSupabase(products);
  }, [products, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveCategoriesToSupabase(categories);
  }, [categories, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveOrdersToSupabase(orders);
  }, [orders, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveSettingsToSupabase(settings);
  }, [settings, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveHeroToSupabase(heroSettings);
  }, [heroSettings, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveFeaturesToSupabase(features);
  }, [features, supabaseLoaded]);

  useEffect(() => {
    if (!supabaseLoaded) return;
    saveTestimonialsToSupabase(testimonials);
  }, [testimonials, supabaseLoaded]);

  // ── Derived ─────────────────────────────────────────────────────
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ── Actions ─────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), []);

  const setAdminPassword = useCallback((pw: string) => {
    setSettings(prev => ({ ...prev, adminPassword: pw }));
  }, []);

  const verifyAdminPassword = useCallback((pw: string) => pw === adminPassword, [adminPassword]);

  const handleLogoClick = useCallback(() => {
    setIsAdmin(p => p ? false : p);
    setLogoClickCount(prev => {
      const n = prev + 1;
      if (n >= 5) {
        setShowAdminLogin(true);
        if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
        return 0;
      }
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
      logoTimerRef.current = setTimeout(() => setLogoClickCount(0), 3000);
      return n;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart    = useCallback((id: string) => setCart(p => p.filter(i => i.product.id !== id)), []);
  const updateCartQuantity = useCallback((id: string, q: number) => {
    if (q <= 0) setCart(p => p.filter(i => i.product.id !== id));
    else setCart(p => p.map(i => i.product.id === id ? { ...i, quantity: q } : i));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const addOrder = useCallback((order: Order) => setOrders(p => [order, ...p]), []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status } : o));
    if (supabaseLoaded) updateOrderStatusInSupabase(orderId, status);
  }, [supabaseLoaded]);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <StoreContext.Provider value={{
      products, setProducts, categories, setCategories,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
      orders, addOrder, updateOrderStatus,
      settings, setSettings, heroSettings, setHeroSettings, features, setFeatures, testimonials, setTestimonials,
      selectedProduct, setSelectedProduct, selectedCategory, setSelectedCategory,
      searchQuery, setSearchQuery, showCart, setShowCart,
      isAdmin, setIsAdmin, showAdminLogin, setShowAdminLogin,
      logoClickCount, handleLogoClick, theme, toggleTheme,
      adminPassword, setAdminPassword, verifyAdminPassword,
      supabaseLoaded,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

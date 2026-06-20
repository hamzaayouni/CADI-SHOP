export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  details: string[];
  brand: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'تم التوصيل' | 'ملغي';
  date: string;
}

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  twitter: string;
  freeShippingThreshold: number;
  currency: string;
  logoUrl: string;
  adminPassword: string;
}

export interface HeroSettings {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  backgroundImage: string;
  stats: { label: string; value: string }[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export type ThemeMode = 'dark' | 'light';

export type Page = 'home' | 'admin' | 'checkout';

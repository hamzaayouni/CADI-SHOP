import { supabase } from '../lib/supabase';
import type { Product, Category, Order, StoreSettings, HeroSettings, FeatureItem, Testimonial } from '../types';

// ═══════════════════════════════════════════════════════════
//  DB ↔ App field mapping
//  (camelCase in React ↔ snake_case in Postgres)
// ═══════════════════════════════════════════════════════════

// ── Products ────────────────────────────────────────────────

export function toDbProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    name_en: p.nameEn || null,
    description: p.description,
    price: p.price,
    old_price: p.oldPrice || null,
    image: p.image,
    category: p.category,
    rating: p.rating,
    reviews: p.reviews,
    in_stock: p.inStock,
    featured: p.featured,
    details: JSON.stringify(p.details),
    brand: p.brand,
    sku: p.sku,
  };
}

export function fromDbProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    nameEn: (row.name_en as string) || undefined,
    description: (row.description as string) || '',
    price: (row.price as number) ?? 0,
    oldPrice: (row.old_price as number) ?? undefined,
    image: (row.image as string) || '',
    category: (row.category as string) || '',
    rating: (row.rating as number) ?? 4.5,
    reviews: (row.reviews as number) ?? 0,
    inStock: (row.in_stock as boolean) ?? true,
    featured: (row.featured as boolean) ?? false,
    details: parseJsonField(row.details, []),
    brand: (row.brand as string) || '',
    sku: (row.sku as string) || '',
  };
}

// ── Categories ──────────────────────────────────────────────

export function toDbCategory(c: Category) {
  return { id: c.id, name: c.name, icon: c.icon, image: c.image, description: c.description };
}

export function fromDbCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    icon: (row.icon as string) || '📦',
    image: (row.image as string) || '',
    description: (row.description as string) || '',
  };
}

// ── Orders ──────────────────────────────────────────────────

export function toDbOrder(o: Order) {
  return {
    id: o.id,
    items: JSON.stringify(o.items),
    total: o.total,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_address: o.customerAddress,
    status: o.status,
    date: o.date,
  };
}

export function fromDbOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    items: parseJsonField(row.items, []),
    total: (row.total as number) ?? 0,
    customerName: (row.customer_name as string) || '',
    customerPhone: (row.customer_phone as string) || '',
    customerAddress: (row.customer_address as string) || '',
    status: (row.status as Order['status']) || 'جديد',
    date: (row.date as string) || '',
  };
}

// ── Settings ────────────────────────────────────────────────

export function toDbSettings(s: StoreSettings) {
  return {
    id: 1,
    store_name: s.storeName,
    store_description: s.storeDescription,
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    address: s.address,
    instagram: s.instagram,
    twitter: s.twitter,
    free_shipping_threshold: s.freeShippingThreshold,
    currency: s.currency,
    logo_url: s.logoUrl,
    admin_password: s.adminPassword,
  };
}

export function fromDbSettings(row: Record<string, unknown>): StoreSettings {
  return {
    storeName: (row.store_name as string) || '',
    storeDescription: (row.store_description as string) || '',
    phone: (row.phone as string) || '',
    whatsapp: (row.whatsapp as string) || '',
    email: (row.email as string) || '',
    address: (row.address as string) || '',
    instagram: (row.instagram as string) || '',
    twitter: (row.twitter as string) || '',
    freeShippingThreshold: (row.free_shipping_threshold as number) ?? 200,
    currency: (row.currency as string) || 'د.م',
    logoUrl: (row.logo_url as string) || '/images/logo.png',
    adminPassword: (row.admin_password as string) || '90809080',
  };
}

// ── Hero ────────────────────────────────────────────────────

export function toDbHero(h: HeroSettings) {
  return {
    id: 1,
    badge: h.badge,
    title: h.title,
    title_highlight: h.titleHighlight,
    subtitle: h.subtitle,
    primary_btn_text: h.primaryBtnText,
    secondary_btn_text: h.secondaryBtnText,
    background_image: h.backgroundImage,
    stats: JSON.stringify(h.stats),
  };
}

export function fromDbHero(row: Record<string, unknown>): HeroSettings {
  return {
    badge: (row.badge as string) || '',
    title: (row.title as string) || '',
    titleHighlight: (row.title_highlight as string) || '',
    subtitle: (row.subtitle as string) || '',
    primaryBtnText: (row.primary_btn_text as string) || '',
    secondaryBtnText: (row.secondary_btn_text as string) || '',
    backgroundImage: (row.background_image as string) || '',
    stats: parseJsonField(row.stats, []),
  };
}

// ── Features ────────────────────────────────────────────────

export function toDbFeature(f: FeatureItem, sortOrder: number) {
  return { id: sortOrder + 1, icon: f.icon, title: f.title, description: f.description, sort_order: sortOrder };
}

export function fromDbFeature(row: Record<string, unknown>): FeatureItem {
  return { icon: (row.icon as string) || '📦', title: (row.title as string) || '', description: (row.description as string) || '' };
}

// ── Testimonials ────────────────────────────────────────────

export function toDbTestimonial(t: Testimonial) {
  return { name: t.name, text: t.text, rating: t.rating };
}

export function fromDbTestimonial(row: Record<string, unknown>): Testimonial {
  return { name: (row.name as string) || '', text: (row.text as string) || '', rating: (row.rating as number) ?? 5 };
}

// ═══════════════════════════════════════════════════════════
//  JSON helper
// ═══════════════════════════════════════════════════════════

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value as T;
}

// ═══════════════════════════════════════════════════════════
//  LOAD — Fetch everything from Supabase
// ═══════════════════════════════════════════════════════════

export interface AllData {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings | null;
  heroSettings: HeroSettings | null;
  features: FeatureItem[];
  testimonials: Testimonial[];
}

export async function loadAllFromSupabase(): Promise<AllData> {
  console.log('[Supabase] Loading all data…');

  const [productsRes, categoriesRes, ordersRes, settingsRes, heroRes, featuresRes, testimonialsRes] = await Promise.all([
    supabase.from('products').select('*').order('id'),
    supabase.from('categories').select('*').order('id'),
    supabase.from('orders').select('*').order('date', { ascending: false }),
    supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('hero_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('features').select('*').order('sort_order'),
    supabase.from('testimonials').select('*'),
  ]);

  if (productsRes.error) console.error('[Supabase] products load error:', productsRes.error.message);
  if (categoriesRes.error) console.error('[Supabase] categories load error:', categoriesRes.error.message);
  if (ordersRes.error) console.error('[Supabase] orders load error:', ordersRes.error.message);
  if (settingsRes.error) console.error('[Supabase] settings load error:', settingsRes.error.message);
  if (heroRes.error) console.error('[Supabase] hero load error:', heroRes.error.message);
  if (featuresRes.error) console.error('[Supabase] features load error:', featuresRes.error.message);
  if (testimonialsRes.error) console.error('[Supabase] testimonials load error:', testimonialsRes.error.message);

  const products = (productsRes.data || []).map(fromDbProduct);
  const categories = (categoriesRes.data || []).map(fromDbCategory);
  const orders = (ordersRes.data || []).map(fromDbOrder);
  const settings = settingsRes.data ? fromDbSettings(settingsRes.data) : null;
  const heroSettings = heroRes.data ? fromDbHero(heroRes.data) : null;
  const features = (featuresRes.data || []).map(fromDbFeature);
  const testimonials = (testimonialsRes.data || []).map(fromDbTestimonial);

  console.log(`[Supabase] Loaded: ${products.length} products, ${categories.length} categories, ${orders.length} orders`);

  return { products, categories, orders, settings, heroSettings, features, testimonials };
}

// ═══════════════════════════════════════════════════════════
//  SAVE — Write individual tables to Supabase
// ═══════════════════════════════════════════════════════════

export async function saveProductsToSupabase(products: Product[]) {
  if (!products.length) return;
  const rows = products.map(toDbProduct);
  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) console.error('[Supabase] save products error:', error.message);
  else console.log(`[Supabase] Saved ${rows.length} products`);
}

export async function deleteProductFromSupabase(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('[Supabase] delete product error:', error.message);
  else console.log(`[Supabase] Deleted product ${id}`);
}

export async function saveCategoriesToSupabase(categories: Category[]) {
  if (!categories.length) return;
  const rows = categories.map(toDbCategory);
  const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' });
  if (error) console.error('[Supabase] save categories error:', error.message);
  else console.log(`[Supabase] Saved ${rows.length} categories`);
}

export async function deleteCategoryFromSupabase(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) console.error('[Supabase] delete category error:', error.message);
  else console.log(`[Supabase] Deleted category ${id}`);
}

export async function saveOrdersToSupabase(orders: Order[]) {
  if (!orders.length) return;
  const rows = orders.map(toDbOrder);
  const { error } = await supabase.from('orders').upsert(rows, { onConflict: 'id' });
  if (error) console.error('[Supabase] save orders error:', error.message);
  else console.log(`[Supabase] Saved ${rows.length} orders`);
}

export async function updateOrderStatusInSupabase(orderId: string, status: string) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) console.error('[Supabase] update order status error:', error.message);
  else console.log(`[Supabase] Updated order ${orderId} → ${status}`);
}

export async function saveSettingsToSupabase(settings: StoreSettings) {
  const row = toDbSettings(settings);
  const { error } = await supabase.from('store_settings').upsert(row, { onConflict: 'id' });
  if (error) console.error('[Supabase] save settings error:', error.message);
  else console.log('[Supabase] Saved settings');
}

export async function saveHeroToSupabase(hero: HeroSettings) {
  const row = toDbHero(hero);
  const { error } = await supabase.from('hero_settings').upsert(row, { onConflict: 'id' });
  if (error) console.error('[Supabase] save hero error:', error.message);
  else console.log('[Supabase] Saved hero');
}

export async function saveFeaturesToSupabase(features: FeatureItem[]) {
  // Delete all then re-insert (simplest for ordered array with generated IDs)
  await supabase.from('features').delete().neq('id', 0);
  if (!features.length) return;
  const rows = features.map((f, i) => toDbFeature(f, i));
  const { error } = await supabase.from('features').insert(rows);
  if (error) console.error('[Supabase] save features error:', error.message);
  else console.log(`[Supabase] Saved ${rows.length} features`);
}

export async function saveTestimonialsToSupabase(testimonials: Testimonial[]) {
  await supabase.from('testimonials').delete().neq('id', 0);
  if (!testimonials.length) return;
  const rows = testimonials.map(toDbTestimonial);
  const { error } = await supabase.from('testimonials').insert(rows);
  if (error) console.error('[Supabase] save testimonials error:', error.message);
  else console.log(`[Supabase] Saved ${rows.length} testimonials`);
}

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import ImageUpload from './ImageUpload';

type AdminTab = 'home' | 'products' | 'orders' | 'categories' | 'sync' | 'settings';

function loadFromStorageLocal(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

const AdminPanel: React.FC = () => {
  const {
    products, setProducts, categories, setCategories,
    orders, updateOrderStatus, settings, setSettings,
    heroSettings, setHeroSettings, features, setFeatures,
    testimonials, setTestimonials, theme,
    setAdminPassword, verifyAdminPassword,
  } = useStore();

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '', nameEn: '', description: '', price: 0, oldPrice: 0,
    image: '', category: 'barber-tools', rating: 4.5, reviews: 0,
    inStock: true, featured: false, details: [''], brand: '', sku: '',
  });

  const resetProductForm = () => {
    setProductForm({ name: '', nameEn: '', description: '', price: 0, oldPrice: 0, image: '', category: 'barber-tools', rating: 4.5, reviews: 0, inStock: true, featured: false, details: [''], brand: '', sku: '' });
  };

  const openEditProduct = (product: Product) => {
    setProductForm({ name: product.name, nameEn: product.nameEn || '', description: product.description, price: product.price, oldPrice: product.oldPrice || 0, image: product.image, category: product.category, rating: product.rating, reviews: product.reviews, inStock: product.inStock, featured: product.featured, details: [...product.details], brand: product.brand, sku: product.sku });
    setEditingProduct(product); setShowProductForm(true);
  };

  const openNewProduct = () => { resetProductForm(); setEditingProduct(null); setShowProductForm(true); };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) { alert('يرجى ملء الحقول المطلوبة'); return; }
    const newProduct: Product = {
      id: editingProduct?.id || 'P-' + Date.now(), name: productForm.name, nameEn: productForm.nameEn || undefined,
      description: productForm.description, price: productForm.price, oldPrice: productForm.oldPrice || undefined,
      image: productForm.image || 'https://images.pexels.com/photos/13809242/pexels-photo-13809242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      category: productForm.category, rating: productForm.rating, reviews: productForm.reviews,
      inStock: productForm.inStock, featured: productForm.featured, details: productForm.details.filter(d => d), brand: productForm.brand, sku: productForm.sku,
    };
    if (editingProduct) { setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p)); }
    else { setProducts(prev => [...prev, newProduct]); }
    setShowProductForm(false); resetProductForm();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('حذف هذا المنتج؟')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also delete from Supabase directly so it's removed even if the upsert effect hasn't run yet
    try {
      const { deleteProductFromSupabase } = await import('../utils/supabaseData');
      await deleteProductFromSupabase(id);
    } catch (e) { console.error('[Admin] delete product from Supabase failed:', e); }
  };

  const handleDetailChange = (index: number, value: string) => {
    const d = [...productForm.details]; d[index] = value; setProductForm({ ...productForm, details: d });
  };
  const addDetail = () => setProductForm({ ...productForm, details: [...productForm.details, ''] });
  const removeDetail = (i: number) => setProductForm({ ...productForm, details: productForm.details.filter((_, j) => j !== i) });

  const statusColors: Record<string, string> = {
    'جديد': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'قيد التجهيز': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'تم الشحن': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'تم التوصيل': 'bg-green-500/20 text-green-400 border-green-500/30',
    'ملغي': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const isDark = theme === 'dark';
  const inputClass = `w-full rounded-xl px-4 py-3 focus:outline-none text-right transition-all theme-input ${
    isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-morocco-gold/50' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-morocco-gold'
  }`;
  const labelClass = `block text-sm font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;
  const cardClass = `rounded-2xl p-6 ${isDark ? 'glass-dark' : 'bg-white border border-gray-100 shadow-sm'}`;
  const innerCardClass = `rounded-xl p-4 ${isDark ? 'glass' : 'bg-gray-50 border border-gray-100'}`;

  const tabs: { id: AdminTab; label: string; icon: string; color: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: '🏠', color: 'from-morocco-gold to-morocco-terracotta' },
    { id: 'products', label: 'المنتجات', icon: '📦', color: 'from-blue-500 to-blue-700' },
    { id: 'orders', label: 'الطلبات', icon: '📋', color: 'from-green-500 to-green-700' },
    { id: 'categories', label: 'الأقسام', icon: '🏷️', color: 'from-purple-500 to-purple-700' },
    { id: 'sync', label: 'النسخ الاحتياطي', icon: '☁️', color: 'from-cyan-500 to-blue-600' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️', color: 'from-gray-500 to-gray-700' },
  ];

  return (
    <div className={`min-h-screen admin-bg zellige-pattern ${isDark ? 'bg-[#0A0A0A]' : 'bg-morocco-cream'}`}>
      <div className={`border-b ${isDark ? 'bg-morocco-dark border-morocco-gold/10' : 'bg-white border-morocco-gold/15'} moroccan-border`}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black gradient-text">🔐 لوحة التحكم</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>إدارة متجر {settings.storeName}</p>
          </div>
          <div className={`text-xs font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>v2.0</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { icon: '📦', label: 'المنتجات', value: products.length, color: 'from-blue-500/20 to-blue-700/10' },
            { icon: '📋', label: 'الطلبات', value: orders.length, color: 'from-green-500/20 to-green-700/10' },
            { icon: '💰', label: 'المبيعات', value: `${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}`, color: 'from-morocco-gold/20 to-morocco-terracotta/10' },
            { icon: '🏷️', label: 'الأقسام', value: categories.length, color: 'from-purple-500/20 to-purple-700/10' },
            { icon: '☁️', label: 'سحابي', value: localStorage.getItem('kadishop_cloud_binid') ? '✓' : '—', color: 'from-cyan-500/20 to-blue-600/10' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-5 bg-gradient-to-l ${stat.color} border ${isDark ? 'border-white/5' : 'border-morocco-gold/10'}`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id ? `bg-gradient-to-l ${tab.color} text-white shadow-lg`
                  : isDark ? 'glass text-gray-400 hover:text-white' : 'bg-white text-gray-400 hover:text-morocco-dark border border-gray-200'
              }`}>{tab.icon} {tab.label}</button>
          ))}
        </div>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>🏠 تعديل الصفحة الرئيسية</h2>

            {/* Logo */}
            <div className={cardClass}>
              <h3 className="font-bold text-morocco-gold mb-4">شعار المتجر</h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-24 flex-shrink-0">
                  <ImageUpload
                    currentImage={settings.logoUrl}
                    onImageChange={(url) => setSettings({ ...settings, logoUrl: url })}
                    compact
                  />
                  <img src={settings.logoUrl} alt="logo" className="w-20 h-20 rounded-full border-2 border-morocco-gold/30 object-cover mx-auto mt-2" />
                </div>
                <div className="flex-1 w-full">
                  <label className={labelClass}>رابط صورة الشعار</label>
                  <input type="url" value={settings.logoUrl} onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} className={inputClass} placeholder="https://..." />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>يمكنك رفع صورة من جهازك أو إدخال رابط</p>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className={cardClass}>
              <h3 className="font-bold text-morocco-gold mb-4">🎬 قسم البطل (Hero)</h3>
              <div className="space-y-4">
                <div><label className={labelClass}>شارة العرض</label>
                  <input type="text" value={heroSettings.badge} onChange={(e) => setHeroSettings({ ...heroSettings, badge: e.target.value })} className={inputClass} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>العنوان</label>
                    <input type="text" value={heroSettings.title} onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })} className={inputClass} /></div>
                  <div><label className={labelClass}>النص المميز</label>
                    <input type="text" value={heroSettings.titleHighlight} onChange={(e) => setHeroSettings({ ...heroSettings, titleHighlight: e.target.value })} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>الوصف</label>
                  <textarea value={heroSettings.subtitle} onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })} className={`${inputClass} h-24 resize-none`} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>الزر الأول</label>
                    <input type="text" value={heroSettings.primaryBtnText} onChange={(e) => setHeroSettings({ ...heroSettings, primaryBtnText: e.target.value })} className={inputClass} /></div>
                  <div><label className={labelClass}>الزر الثاني</label>
                    <input type="text" value={heroSettings.secondaryBtnText} onChange={(e) => setHeroSettings({ ...heroSettings, secondaryBtnText: e.target.value })} className={inputClass} /></div>
                </div>
                <div>
                  <label className={labelClass}>صورة الخلفية</label>
                  <ImageUpload
                    currentImage={heroSettings.backgroundImage}
                    onImageChange={(url) => setHeroSettings({ ...heroSettings, backgroundImage: url })}
                  />
                  <div className="mt-2">
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>أو أدخل رابط:</label>
                    <input type="url" value={heroSettings.backgroundImage.startsWith('data:') ? '' : heroSettings.backgroundImage} onChange={(e) => setHeroSettings({ ...heroSettings, backgroundImage: e.target.value })} className={`${inputClass} text-sm`} placeholder="https://..." />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-gray-400 text-sm">الإحصائيات</label>
                    <button onClick={() => setHeroSettings({ ...heroSettings, stats: [...heroSettings.stats, { label: '', value: '' }] })} className="text-morocco-gold text-sm font-bold">+ إضافة</button>
                  </div>
                  {heroSettings.stats.map((stat, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={stat.value} onChange={(e) => { const s = [...heroSettings.stats]; s[i] = { ...s[i], value: e.target.value }; setHeroSettings({ ...heroSettings, stats: s }); }} className={`${inputClass} flex-1`} placeholder="القيمة" />
                      <input type="text" value={stat.label} onChange={(e) => { const s = [...heroSettings.stats]; s[i] = { ...s[i], label: e.target.value }; setHeroSettings({ ...heroSettings, stats: s }); }} className={`${inputClass} flex-1`} placeholder="الوصف" />
                      <button onClick={() => setHeroSettings({ ...heroSettings, stats: heroSettings.stats.filter((_, j) => j !== i) })} className="text-red-400 px-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className={cardClass}>
              <h3 className="font-bold text-morocco-gold mb-4">✨ شريط الميزات</h3>
              {features.map((f, i) => (
                <div key={i} className="flex gap-2 mb-3 items-center">
                  <input type="text" value={f.icon} onChange={(e) => { const nf = [...features]; nf[i] = { ...nf[i], icon: e.target.value }; setFeatures(nf); }} className={`${inputClass} w-16 text-center`} placeholder="🚚" />
                  <input type="text" value={f.title} onChange={(e) => { const nf = [...features]; nf[i] = { ...nf[i], title: e.target.value }; setFeatures(nf); }} className={`${inputClass} flex-1`} placeholder="العنوان" />
                  <input type="text" value={f.description} onChange={(e) => { const nf = [...features]; nf[i] = { ...nf[i], description: e.target.value }; setFeatures(nf); }} className={`${inputClass} flex-1`} placeholder="الوصف" />
                  <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="text-red-400 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => setFeatures([...features, { icon: '📦', title: '', description: '' }])} className="text-morocco-gold text-sm font-bold mt-2">+ إضافة ميزة</button>
            </div>

            {/* Testimonials */}
            <div className={cardClass}>
              <h3 className="font-bold text-morocco-gold mb-4">💬 آراء العملاء</h3>
              {testimonials.map((t, i) => (
                <div key={i} className={`${innerCardClass} mb-3`}>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={t.name} onChange={(e) => { const nt = [...testimonials]; nt[i] = { ...nt[i], name: e.target.value }; setTestimonials(nt); }} className={`${inputClass} flex-1`} placeholder="الاسم" />
                    <select value={t.rating} onChange={(e) => { const nt = [...testimonials]; nt[i] = { ...nt[i], rating: Number(e.target.value) }; setTestimonials(nt); }} className={`${inputClass} w-20`}>
                      {[1,2,3,4,5].map(r => <option key={r} value={r}>{'★'.repeat(r)}</option>)}
                    </select>
                    <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="text-red-400 px-2">✕</button>
                  </div>
                  <textarea value={t.text} onChange={(e) => { const nt = [...testimonials]; nt[i] = { ...nt[i], text: e.target.value }; setTestimonials(nt); }} className={`${inputClass} w-full h-20 resize-none`} placeholder="الرأي" />
                </div>
              ))}
              <button onClick={() => setTestimonials([...testimonials, { name: '', text: '', rating: 5 }])} className="text-morocco-gold text-sm font-bold mt-2">+ إضافة رأي</button>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>📦 المنتجات</h2>
              <button onClick={openNewProduct} className="btn-moroccan px-6 py-3 rounded-xl text-sm">+ إضافة منتج</button>
            </div>
            <div className="space-y-3">
              {products.map((product) => {
                const cat = categories.find(c => c.id === product.category);
                return (
                  <div key={product.id} className={`${cardClass} flex items-center gap-4 !p-4 hover-lift`}>
                    <div className="relative group/img">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover border border-morocco-gold/10" />
                      <input
                        id={`prod-img-${product.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const { compressImage, validateImageFile } = await import('../utils/upload');
                              const err = validateImageFile(file);
                              if (err) { alert(err); return; }
                              const dataUrl = await compressImage(file, 600);
                              setProducts(prev => prev.map(p => p.id === product.id ? { ...p, image: dataUrl } : p));
                            } catch { alert('فشل في رفع الصورة'); }
                          }
                        }}
                      />
                      <button
                        onClick={() => document.getElementById(`prod-img-${product.id}`)?.click()}
                        className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
                        title="تغيير الصورة"
                      >📷</button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{product.name}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{product.brand} • {cat?.name}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-black text-morocco-gold">{product.price} {settings.currency}</div>
                      {product.oldPrice && <div className={`text-xs line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{product.oldPrice}</div>}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${product.inStock ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{product.inStock ? 'متوفر' : 'نفذ'}</span>
                      {product.featured && <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-morocco-gold/10 text-morocco-gold border border-morocco-gold/20">مميز</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditProduct(product)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? 'glass text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>✏️</button>
                      <button onClick={() => deleteProduct(product.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isDark ? 'glass text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 className={`text-xl font-black mb-6 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>📋 الطلبات</h2>
            {orders.length === 0 ? (
              <div className={`${cardClass} p-12 text-center`}>
                <div className="text-6xl mb-4">📋</div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>لا توجد طلبات بعد</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className={cardClass}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>{order.status}</span>
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📅 {order.date}</div>
                      </div>
                      <div className="text-2xl font-black gradient-text">{order.total} {settings.currency}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className={innerCardClass}>
                        <h4 className={`font-bold mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>بيانات العميل</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>👤 {order.customerName}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>📱 {order.customerPhone}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>📍 {order.customerAddress}</p>
                      </div>
                      <div className={innerCardClass}>
                        <h4 className={`font-bold mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>المنتجات</h4>
                        {order.items.map((item) => (
                          <div key={item.product.id} className={`flex justify-between text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span>{item.product.name} × {item.quantity}</span>
                            <span className="text-morocco-gold">{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs py-1.5 ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>تحديث:</span>
                      {(['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التوصيل', 'ملغي'] as const).map((status) => (
                        <button key={status} onClick={() => updateOrderStatus(order.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            order.status === status ? statusColors[status] : isDark ? 'glass text-gray-500 hover:text-white border-white/5' : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-morocco-dark'
                          }`}>{status}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <h2 className={`text-xl font-black mb-6 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>🏷️ الأقسام</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className={`${cardClass} !p-0 overflow-hidden hover-lift`}>
                  <div className="h-28 overflow-hidden relative cursor-pointer group/img" onClick={() => {
                    const input = document.getElementById(`cat-img-${category.id}`);
                    input?.click();
                  }}>
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📷 تغيير الصورة</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <input
                      id={`cat-img-${category.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { compressImage, validateImageFile } = await import('../utils/upload');
                            const err = validateImageFile(file);
                            if (err) { alert(err); return; }
                            const dataUrl = await compressImage(file, 600);
                            setCategories(prev => prev.map(c => c.id === category.id ? { ...c, image: dataUrl } : c));
                          } catch { alert('فشل في رفع الصورة'); }
                        }
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{category.name}</h3>
                      <span className={`text-xs mr-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{products.filter(p => p.category === category.id).length} منتج</span>
                    </div>
                    <div className="space-y-2">
                      <input type="text" defaultValue={category.name} className={`${inputClass} text-sm`} placeholder="الاسم"
                        onBlur={(e) => { if (e.target.value.trim()) setCategories(prev => prev.map(c => c.id === category.id ? { ...c, name: e.target.value.trim() } : c)); }} />
                      <input type="url" defaultValue={category.image.startsWith('data:') ? '' : category.image} className={`${inputClass} text-sm`} placeholder="أو أدخل رابط الصورة"
                        onBlur={(e) => { if (e.target.value.trim()) setCategories(prev => prev.map(c => c.id === category.id ? { ...c, image: e.target.value.trim() } : c)); }} />
                      <button onClick={async () => {
                        if (!confirm('حذف القسم؟')) return;
                        setCategories(prev => prev.filter(c => c.id !== category.id));
                        try {
                          const { deleteCategoryFromSupabase } = await import('../utils/supabaseData');
                          await deleteCategoryFromSupabase(category.id);
                        } catch (e) { console.error('[Admin] delete category from Supabase failed:', e); }
                      }}
                        className="w-full text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors">🗑️ حذف</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className={`rounded-2xl border-2 border-dashed flex items-center justify-center min-h-[250px] cursor-pointer transition-colors group ${
                isDark ? 'border-morocco-gold/20 hover:border-morocco-gold/50' : 'border-morocco-gold/30 hover:border-morocco-gold/60 bg-white'
              }`}
                onClick={() => {
                  const name = prompt('اسم القسم الجديد:');
                  if (name?.trim()) {
                    setCategories(prev => [...prev, { id: name.trim().toLowerCase().replace(/\s+/g, '-'), name: name.trim(), icon: '📦', image: 'https://images.pexels.com/photos/13809242/pexels-photo-13809242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: '' }]);
                  }
                }}>
                <div className={`text-center transition-colors ${isDark ? 'text-gray-600 group-hover:text-morocco-gold' : 'text-gray-400 group-hover:text-morocco-gold'}`}>
                  <div className="text-4xl mb-2">+</div>
                  <div className="font-bold text-sm">إضافة قسم جديد</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYNC TAB */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>☁️ النسخ الاحتياطي والمزامنة</h2>

            {/* Export */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl">📤</div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-morocco-dark'}`}>تصدير البيانات</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>حمل نسخة احتياطية كاملة من بيانات المتجر كملف JSON</p>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                يتيح لك تصدير جميع البيانات (المنتجات، الأقسام، الإعدادات، الطلبات) كملف JSON يمكنك استيراده على أي جهاز آخر.
              </p>
              <button onClick={async () => {
                const { gatherStoreData, exportToFile } = await import('../utils/sync');
                const data = gatherStoreData({ products, categories, settings, heroSettings, features, testimonials, adminPassword: '' });
                exportToFile(data);
              }} className="btn-moroccan px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                📤 تصدير البيانات الآن
              </button>
            </div>

            {/* Import */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">📥</div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-morocco-dark'}`}>استيراد البيانات</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>استعادة بيانات المتجر من ملف نسخة احتياطية</p>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                اختر ملف JSON تم تصديره مسبقاً لاستعادة جميع البيانات على هذا الجهاز. <span className="text-red-400 font-bold">سيتم استبدال البيانات الحالية!</span>
              </p>
              <button onClick={async () => {
                try {
                  const { importFromFile } = await import('../utils/sync');
                  const data = await importFromFile();
                  if (data.products) setProducts(data.products);
                  if (data.categories) setCategories(data.categories);
                  if (data.settings) setSettings(data.settings);
                  if (data.heroSettings) setHeroSettings(data.heroSettings);
                  if (data.features) setFeatures(data.features);
                  if (data.testimonials) setTestimonials(data.testimonials);
                  if (data.adminPassword) setAdminPassword(data.adminPassword);
                  alert('✅ تم استيراد البيانات بنجاح!');
                } catch (err: any) {
                  alert('❌ ' + (err.message || 'فشل في استيراد البيانات'));
                }
              }} className={`px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2 font-bold transition-all ${
                isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
              }`}>
                📥 استيراد من ملف
              </button>
            </div>

            {/* Cloud Sync */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-xl">☁️</div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-morocco-dark'}`}>المزامنة السحابية</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>مزامنة بياناتك بين الأجهزة عبر JSONBin.io</p>
                </div>
              </div>

              <div className={`rounded-xl p-4 mb-4 ${isDark ? 'glass' : 'bg-gray-50 border border-gray-100'}`}>
                <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>📋 خطوات الإعداد:</h4>
                <ol className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>1. اذهب إلى <a href="https://jsonbin.io" target="_blank" rel="noopener" className="text-morocco-gold underline hover:text-morocco-gold-light">jsonbin.io</a> وأنشئ حساباً مجانياً</li>
                  <li>2. من لوحة التحكم، انسخ <span className="text-morocco-gold font-bold">API Key</span> (مفتاح API)</li>
                  <li>3. الصق المفتاح أدناه واضغط "إنشاء نسخة سحابية"</li>
                  <li>4. احتفظ بـ <span className="text-morocco-gold font-bold">Bin ID</span> — استخدمه على أي جهاز لمزامنة البيانات</li>
                </ol>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>API Key (مفتاح API) *</label>
                  <input
                    id="cloud-api-key"
                    type="password"
                    className={inputClass}
                    placeholder="$2a$10$..."
                    defaultValue={loadFromStorageLocal('kadishop_cloud_apikey', '')}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bin ID (معرّف الحاوية)</label>
                  <input
                    id="cloud-bin-id"
                    type="text"
                    className={inputClass}
                    placeholder="سيظهر بعد إنشاء النسخة السحابية"
                    defaultValue={loadFromStorageLocal('kadishop_cloud_binid', '')}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Create */}
                  <button onClick={async () => {
                    const apiKey = (document.getElementById('cloud-api-key') as HTMLInputElement)?.value?.trim();
                    if (!apiKey) { alert('أدخل API Key أولاً'); return; }
                    try {
                      const { cloudCreate, gatherStoreData } = await import('../utils/sync');
                      const data = gatherStoreData({ products, categories, settings, heroSettings, features, testimonials, adminPassword: '' });
                      const config = await cloudCreate(apiKey, data);
                      (document.getElementById('cloud-bin-id') as HTMLInputElement).value = config.binId;
                      localStorage.setItem('kadishop_cloud_apikey', apiKey);
                      localStorage.setItem('kadishop_cloud_binid', config.binId);
                      alert('✅ تم إنشاء النسخة السحابية بنجاح!\nBin ID: ' + config.binId + '\nاحتفظ بهذا المعرّف لمزامنة البيانات على أجهزة أخرى.');
                    } catch (err: any) {
                      alert('❌ فشل: ' + (err.message || 'تحقق من API Key'));
                    }
                  }} className="btn-moroccan px-6 py-3 rounded-xl text-sm">
                    ☁️ إنشاء نسخة سحابية
                  </button>

                  {/* Save to Cloud */}
                  <button onClick={async () => {
                    const apiKey = (document.getElementById('cloud-api-key') as HTMLInputElement)?.value?.trim();
                    const binId = (document.getElementById('cloud-bin-id') as HTMLInputElement)?.value?.trim();
                    if (!apiKey || !binId) { alert('أدخل API Key و Bin ID'); return; }
                    try {
                      const { cloudSave, gatherStoreData } = await import('../utils/sync');
                      const data = gatherStoreData({ products, categories, settings, heroSettings, features, testimonials, adminPassword: '' });
                      await cloudSave({ apiKey, binId }, data);
                      localStorage.setItem('kadishop_cloud_apikey', apiKey);
                      localStorage.setItem('kadishop_cloud_binid', binId);
                      alert('✅ تم حفظ البيانات في السحابة بنجاح!');
                    } catch (err: any) {
                      alert('❌ فشل الحفظ: ' + (err.message || 'تحقق من البيانات'));
                    }
                  }} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    isDark ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}>
                    📤 رفع إلى السحابة
                  </button>

                  {/* Load from Cloud */}
                  <button onClick={async () => {
                    const apiKey = (document.getElementById('cloud-api-key') as HTMLInputElement)?.value?.trim();
                    const binId = (document.getElementById('cloud-bin-id') as HTMLInputElement)?.value?.trim();
                    if (!apiKey || !binId) { alert('أدخل API Key و Bin ID'); return; }
                    if (!confirm('سيتم استبدال البيانات الحالية بالبيانات السحابية. متابعة؟')) return;
                    try {
                      const { cloudLoad } = await import('../utils/sync');
                      const data = await cloudLoad({ apiKey, binId });
                      if (data.products) setProducts(data.products);
                      if (data.categories) setCategories(data.categories);
                      if (data.settings) setSettings(data.settings);
                      if (data.heroSettings) setHeroSettings(data.heroSettings);
                      if (data.features) setFeatures(data.features);
                      if (data.testimonials) setTestimonials(data.testimonials);
                      if (data.adminPassword) setAdminPassword(data.adminPassword);
                      localStorage.setItem('kadishop_cloud_apikey', apiKey);
                      localStorage.setItem('kadishop_cloud_binid', binId);
                      alert('✅ تم تحميل البيانات من السحابة بنجاح!');
                    } catch (err: any) {
                      alert('❌ فشل التحميل: ' + (err.message || 'تحقق من البيانات'));
                    }
                  }} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                  }`}>
                    📥 تحميل من السحابة
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-sync reminder */}
            <div className={`rounded-xl p-4 ${isDark ? 'glass-gold' : 'bg-morocco-gold/10 border border-morocco-gold/20'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className={`font-bold text-sm mb-1 text-morocco-gold`}>نصيحة</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    لحفظ تغييراتك عبر الأجهزة: بعد تعديل أي شيء في لوحة التحكم، اضغط "رفع إلى السحابة". على الجهاز الآخر، اضغط "تحميل من السحابة" لاستلام التحديثات.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>⚙️ الإعدادات</h2>
            <div className={`${cardClass} space-y-6`}>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'اسم المتجر', key: 'storeName' as const },
                  { label: 'وصف المتجر', key: 'storeDescription' as const },
                  { label: 'رقم الهاتف', key: 'phone' as const },
                  { label: 'واتساب', key: 'whatsapp' as const },
                  { label: 'البريد الإلكتروني', key: 'email' as const },
                  { label: 'العنوان', key: 'address' as const },
                  { label: 'انستغرام', key: 'instagram' as const },
                  { label: 'تويتر', key: 'twitter' as const },
                ].map(field => (
                  <div key={field.key}>
                    <label className={labelClass}>{field.label}</label>
                    <input type="text" value={settings[field.key]} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className={inputClass} />
                  </div>
                ))}
                <div><label className={labelClass}>حد الشحن المجاني</label>
                  <input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} className={inputClass} /></div>
                <div><label className={labelClass}>العملة</label>
                  <input type="text" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className={inputClass} /></div>
              </div>
              <div className={`rounded-xl p-4 text-sm ${isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                ✅ يتم حفظ جميع الإعدادات تلقائياً
              </div>
            </div>

            {/* Password Reset Section */}
            <div className={cardClass}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isDark ? 'bg-morocco-gold/10' : 'bg-morocco-gold/10'}`}>
                  🔑
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-morocco-dark'}`}>تغيير كلمة المرور</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>قم بتغيير كلمة مرور لوحة التحكم</p>
                </div>
              </div>

              {pwMessage && (
                <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-bold border ${
                  pwMessage.type === 'success'
                    ? isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200'
                    : isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {pwMessage.type === 'success' ? '✅' : '❌'} {pwMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>كلمة المرور الحالية</label>
                  <input type="password" value={pwCurrent} onChange={(e) => { setPwCurrent(e.target.value); setPwMessage(null); }}
                    className={inputClass} placeholder="أدخل كلمة المرور الحالية" />
                </div>
                <div>
                  <label className={labelClass}>كلمة المرور الجديدة</label>
                  <input type="password" value={pwNew} onChange={(e) => { setPwNew(e.target.value); setPwMessage(null); }}
                    className={inputClass} placeholder="أدخل كلمة المرور الجديدة" />
                </div>
                <div>
                  <label className={labelClass}>تأكيد كلمة المرور الجديدة</label>
                  <input type="password" value={pwConfirm} onChange={(e) => { setPwConfirm(e.target.value); setPwMessage(null); }}
                    className={inputClass} placeholder="أعد إدخال كلمة المرور الجديدة" />
                </div>
                <button onClick={() => {
                  if (!pwCurrent || !pwNew || !pwConfirm) {
                    setPwMessage({ type: 'error', text: 'يرجى ملء جميع الحقول' });
                    return;
                  }
                  if (!verifyAdminPassword(pwCurrent)) {
                    setPwMessage({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
                    setPwCurrent('');
                    return;
                  }
                  if (pwNew.length < 4) {
                    setPwMessage({ type: 'error', text: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل' });
                    return;
                  }
                  if (pwNew !== pwConfirm) {
                    setPwMessage({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة' });
                    return;
                  }
                  setAdminPassword(pwNew);
                  setPwCurrent('');
                  setPwNew('');
                  setPwConfirm('');
                  setPwMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح!' });
                }} className="btn-moroccan px-8 py-3 rounded-xl text-sm">
                  🔑 تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-start justify-center p-4 overflow-y-auto">
          <div className={`rounded-2xl max-w-2xl w-full my-8 ${isDark ? 'glass-dark border border-morocco-gold/10' : 'bg-white shadow-2xl border border-morocco-gold/15'}`}>
            <div className="moroccan-border" />
            <div className="p-5 flex justify-between items-center">
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{editingProduct ? '✏️ تعديل منتج' : '➕ إضافة منتج'}</h3>
              <button onClick={() => { setShowProductForm(false); resetProductForm(); }} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'glass text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>✕</button>
            </div>
            <div className="p-6 pt-0 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>اسم المنتج (عربي) *</label><input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>اسم المنتج (إنجليزي)</label><input type="text" value={productForm.nameEn} onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>العلامة التجارية *</label><input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>رمز المنتج (SKU)</label><input type="text" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>السعر *</label><input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} className={inputClass} /></div>
                <div><label className={labelClass}>السعر قبل الخصم</label><input type="number" value={productForm.oldPrice} onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })} className={inputClass} /></div>
                <div><label className={labelClass}>القسم</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className={inputClass}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
                <div>
                  <label className={labelClass}>صورة المنتج</label>
                  <ImageUpload
                    currentImage={productForm.image}
                    onImageChange={(url) => setProductForm({ ...productForm, image: url })}
                  />
                  <div className="mt-2">
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>أو أدخل رابط:</label>
                    <input type="url" value={productForm.image.startsWith('data:') ? '' : productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className={`${inputClass} text-sm`} placeholder="https://..." />
                  </div>
                </div>
              </div>
              <div><label className={labelClass}>الوصف</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className={`${inputClass} h-24 resize-none`} /></div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-gray-400">المواصفات</label>
                  <button onClick={addDetail} className="text-morocco-gold text-sm font-bold">+ إضافة</button>
                </div>
                {productForm.details.map((detail, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" value={detail} onChange={(e) => handleDetailChange(index, e.target.value)} className={`${inputClass} text-sm`} placeholder={`المواصفة ${index + 1}`} />
                    {productForm.details.length > 1 && <button onClick={() => removeDetail(index)} className="text-red-400 px-2">✕</button>}
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} className="w-5 h-5 rounded accent-morocco-gold" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>متوفر</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-5 h-5 rounded accent-morocco-gold" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>مميز</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button onClick={handleSaveProduct} className="flex-1 btn-moroccan py-3 rounded-xl">{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                <button onClick={() => { setShowProductForm(false); resetProductForm(); }} className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'glass text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

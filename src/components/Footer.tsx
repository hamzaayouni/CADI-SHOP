import React from 'react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { settings, categories, theme } = useStore();

  return (
    <footer className="relative">
      {/* CTA */}
      <div className="relative bg-gradient-to-l from-morocco-red via-morocco-red to-morocco-dark py-16 overflow-hidden">
        <div className="absolute inset-0 zellige-pattern opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">جاهز لتجربة <span className="text-morocco-gold">مختلفة</span>؟</h2>
          <p className="text-xl text-red-200/70 mb-8">انضم لأكثر من 10,000 عميل سعيد واكتشف الفرق مع قادي شوب</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#products" className="bg-white text-morocco-red px-10 py-4 rounded-xl font-bold text-lg hover:bg-morocco-gold hover:text-black transition-all shadow-xl">تسوق الآن</a>
            <a href={`https://wa.me/${settings.whatsapp}`} className="glass-gold text-morocco-gold px-10 py-4 rounded-xl font-bold text-lg hover:bg-morocco-gold/20 transition-all border border-morocco-gold/30">💬 واتساب</a>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-l from-morocco-gold via-amber-600 to-morocco-gold">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-black mb-1">اشترك في نشرتنا البريدية</h3>
              <p className="text-black/60">احصل على أحدث العروض والمنتجات الجديدة</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 md:w-80 px-5 py-3 rounded-r-xl text-gray-900 focus:outline-none bg-white/90" />
              <button className="bg-morocco-dark text-morocco-gold px-8 py-3 rounded-l-xl font-bold hover:bg-black transition-colors">اشترك</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={`border-t ${theme === 'dark' ? 'bg-morocco-dark border-morocco-gold/10' : 'bg-morocco-cream border-morocco-gold/15'}`}>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-morocco-gold/30 rounded-full blur-md" />
                  <img src={settings.logoUrl} alt="قادي شوب" className="relative w-10 h-10 rounded-full border-2 border-morocco-gold/60" />
                </div>
                <h3 className="text-xl font-black gradient-text">{settings.storeName}</h3>
              </div>
              <p className={`leading-relaxed mb-4 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{settings.storeDescription}</p>
              <div className="flex gap-3">
                {['📷', '🐦', '💬', '📱'].map((icon, i) => (
                  <button key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    theme === 'dark' ? 'glass hover:bg-morocco-gold/20 text-gray-500 hover:text-morocco-gold' : 'bg-white border border-gray-200 hover:bg-morocco-gold/10 text-gray-400 hover:text-morocco-gold'
                  }`}>{icon}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-morocco-gold text-lg mb-4">الأقسام</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}><a href="#categories" className={`flex items-center gap-2 text-sm transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-morocco-gold' : 'text-gray-500 hover:text-morocco-terracotta'}`}>
                    <span>{category.icon}</span> {category.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-morocco-gold text-lg mb-4">روابط مهمة</h4>
              <ul className="space-y-3">
                {['من نحن', 'سياسة الشحن', 'سياسة الإرجاع', 'الأسئلة الشائعة', 'اتصل بنا'].map((link) => (
                  <li key={link}><a href="#" className={`text-sm transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-morocco-gold' : 'text-gray-500 hover:text-morocco-terracotta'}`}>{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-morocco-gold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-3">
                <li className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>📞 {settings.phone}</li>
                <li className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>📧 {settings.email}</li>
                <li className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>📍 {settings.address}</li>
                <li className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>💬 واتساب: {settings.whatsapp}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={`border-t ${theme === 'dark' ? 'border-white/5' : 'border-morocco-gold/10'}`}>
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>© 2024 {settings.storeName}. جميع الحقوق محفوظة</p>
            <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              <span>💳 طرق الدفع:</span>
              {['Visa', 'Mastercard', 'CMI', 'Cash'].map(m => (
                <span key={m} className={`px-2 py-0.5 rounded text-xs ${theme === 'dark' ? 'glass' : 'bg-white border border-gray-200'}`}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

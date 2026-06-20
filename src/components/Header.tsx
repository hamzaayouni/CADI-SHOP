import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const Header: React.FC = () => {
  const {
    settings, cartCount, setShowCart, setSearchQuery, searchQuery,
    setIsAdmin, isAdmin, handleLogoClick, logoClickCount,
    theme, toggleTheme, showAdminLogin, setShowAdminLogin, verifyAdminPassword,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoPulse, setLogoPulse] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginShake, setLoginShake] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onLogoClick = () => {
    if (isAdmin) { setIsAdmin(false); return; }
    setLogoPulse(true);
    setTimeout(() => setLogoPulse(false), 600);
    handleLogoClick();
  };

  const handleAdminLogin = () => {
    if (verifyAdminPassword(adminPassword)) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة');
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 500);
      setAdminPassword('');
    }
  };

  const closeAdminLogin = () => {
    setShowAdminLogin(false);
    setAdminPassword('');
    setLoginError('');
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Top Bar - hidden on very small screens */}
      <div className={`hidden sm:block border-b text-xs py-1.5 zellige-pattern ${
        isDark ? 'bg-gradient-to-l from-morocco-dark via-[#0D0D0D] to-morocco-dark text-gray-400 border-morocco-gold/10'
               : 'bg-gradient-to-l from-morocco-sand via-morocco-cream to-morocco-sand text-gray-600 border-morocco-gold/20'
      }`}>
        <div className="max-w-7xl mx-auto px-3 flex justify-between items-center">
          <div className="flex items-center gap-3 text-[11px]">
            <span>📞 {settings.phone}</span>
            <span>📧 {settings.email}</span>
          </div>
          <div className="text-morocco-gold text-[11px]">🚚 شحن مجاني فوق {settings.freeShippingThreshold} {settings.currency}</div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? isDark ? 'glass-dark shadow-2xl shadow-black/50' : 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : isDark ? 'bg-morocco-dark/95' : 'bg-white/95'
      }`}>
        <div className="moroccan-border" />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0 group" onClick={onLogoClick}>
              <div className="relative">
                <div className="absolute inset-0 bg-morocco-gold/30 rounded-full blur-md group-hover:bg-morocco-gold/50 transition-all" />
                <img src={settings.logoUrl} alt="قادي شوب"
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-morocco-gold/60 group-hover:border-morocco-gold transition-all group-hover:scale-110 ${logoPulse ? 'logo-pulse' : ''}`}
                />
                {logoClickCount > 0 && logoClickCount < 5 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-morocco-gold text-black text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {5 - logoClickCount}
                  </div>
                )}
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-2xl font-black gradient-text leading-tight">{settings.storeName}</h1>
                <p className={`text-[8px] sm:text-[10px] tracking-wider leading-tight ${isDark ? 'text-morocco-gold/70' : 'text-morocco-terracotta'}`}>CADI STORE</p>
              </div>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="flex w-full">
                <input type="text" placeholder="ابحث عن منتج..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 rounded-r-xl px-4 py-2.5 focus:outline-none text-right transition-all theme-input ${
                    isDark ? 'bg-white/5 border border-morocco-gold/20 text-white placeholder-gray-500 focus:border-morocco-gold/60 focus:bg-white/10'
                           : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-morocco-gold'
                  }`} />
                <button className="bg-gradient-to-l from-morocco-gold to-morocco-terracotta text-white px-5 rounded-l-xl hover:shadow-lg hover:shadow-morocco-gold/30 transition-all">🔍</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="theme-toggle" title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}>
                <div className="theme-toggle-knob">{isDark ? '🌙' : '☀️'}</div>
              </button>

              {/* Cart */}
              <button onClick={() => setShowCart(true)}
                className={`relative p-2.5 sm:p-3 rounded-xl transition-all group ${
                  isDark ? 'glass-gold text-morocco-gold hover:bg-morocco-gold/20' : 'bg-morocco-gold/10 text-morocco-gold hover:bg-morocco-gold/20 border border-morocco-gold/20'
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-gradient-to-l from-morocco-red to-red-600 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-black animate-pulse">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>

              {/* Admin Badge */}
              {isAdmin && (
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${isDark ? 'text-morocco-gold bg-morocco-gold/10' : 'text-morocco-terracotta bg-morocco-terracotta/10'}`}>🔐</span>
                  <button onClick={() => setIsAdmin(false)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${isDark ? 'glass text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>خروج</button>
                </div>
              )}

              {/* Hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${isDark ? 'glass text-white' : 'bg-gray-100 text-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 animate-slide-up">
              <div className="flex">
                <input type="text" placeholder="ابحث عن منتج..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 rounded-r-xl px-3 py-2.5 focus:outline-none text-right text-sm theme-input ${
                    isDark ? 'bg-white/5 border border-morocco-gold/20 text-white placeholder-gray-500' : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`} />
                <button className="bg-gradient-to-l from-morocco-gold to-morocco-terracotta text-white px-3 rounded-l-xl text-sm">🔍</button>
              </div>
              {/* Mobile nav links */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="whitespace-nowrap text-xs font-bold px-3 py-2 rounded-lg bg-morocco-gold/10 text-morocco-gold">الأقسام</a>
                <a href="#products" onClick={() => setMobileMenuOpen(false)} className="whitespace-nowrap text-xs font-bold px-3 py-2 rounded-lg bg-morocco-gold/10 text-morocco-gold">المنتجات</a>
                <span className={`whitespace-nowrap text-xs px-3 py-2 rounded-lg ${isDark ? 'text-gray-400 bg-white/5' : 'text-gray-500 bg-gray-100'}`}>🚚 شحن مجاني +{settings.freeShippingThreshold} {settings.currency}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4" onClick={closeAdminLogin}>
          <div className={`max-w-sm w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up ${loginShake ? 'animate-shake' : ''} ${
            isDark ? 'glass-dark border border-morocco-gold/20' : 'bg-white border border-morocco-gold/15'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className="moroccan-border" />
            <div className="bg-gradient-to-l from-morocco-gold/10 to-transparent p-5 sm:p-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-morocco-gold/20 rounded-full blur-xl" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-l from-morocco-gold to-morocco-terracotta rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-morocco-gold/30">🔐</div>
              </div>
              <h3 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>دخول لوحة التحكم</h3>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>أدخل كلمة المرور للوصول</p>
            </div>
            <div className="p-4 sm:p-6 pt-2">
              {loginError && (
                <div className="mb-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl text-center">❌ {loginError}</div>
              )}
              <div className="mb-3">
                <label className={`block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>كلمة المرور</label>
                <input type="password" value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="••••••••"
                  className={`w-full rounded-xl px-3 sm:px-4 py-3 focus:outline-none text-right text-base sm:text-lg tracking-widest transition-all theme-input ${
                    isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-700 focus:border-morocco-gold/50'
                           : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-300 focus:border-morocco-gold'
                  }`}
                  autoFocus />
              </div>
              <button onClick={handleAdminLogin} className="w-full btn-moroccan py-3.5 rounded-xl text-base sm:text-lg mb-2.5">دخول ←</button>
              <button onClick={closeAdminLogin}
                className={`w-full py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm ${isDark ? 'glass text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </>
  );
};

export default Header;

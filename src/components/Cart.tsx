import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

const Cart: React.FC = () => {
  const { cart, showCart, setShowCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount, settings, addOrder, theme } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!showCart) return null;

  const shipping = cartTotal >= settings.freeShippingThreshold ? 0 : 25;
  const total = cartTotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const orderId = 'ORD-' + Date.now();
    const order: Order = {
      id: orderId,
      items: [...cart],
      total,
      customerName,
      customerPhone,
      customerAddress,
      status: 'جديد',
      date: new Date().toLocaleDateString('ar-SA'),
    };
    addOrder(order);
    clearCart();
    setShowCheckout(false);
    setOrderNumber(orderId);
    setOrderSuccess(true);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  const closeSuccess = () => {
    setOrderSuccess(false);
    setShowCart(false);
  };

  const inputClass = `w-full rounded-xl px-4 py-3 focus:outline-none text-right transition-all theme-input ${
    theme === 'dark'
      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-morocco-gold/50'
      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-morocco-gold'
  }`;

  const labelClass = `block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <div className="fixed inset-0 z-[80]" onClick={() => !orderSuccess && setShowCart(false)}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Success Overlay */}
      {orderSuccess && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl p-8 text-center success-pop ${
            theme === 'dark' ? 'glass-dark border border-morocco-gold/20' : 'bg-white shadow-2xl border border-morocco-gold/20'
          }`}>
            {/* Animated Checkmark */}
            <div className="mx-auto w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-20" />
              <div className="relative w-24 h-24 bg-gradient-to-l from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 checkmark-svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>
              🎉 تم تأكيد طلبك بنجاح!
            </h2>

            <div className={`rounded-xl p-4 mb-4 ${theme === 'dark' ? 'glass-gold' : 'bg-morocco-gold/10 border border-morocco-gold/20'}`}>
              <p className="text-morocco-gold font-bold text-lg mb-1">رقم الطلب: {orderNumber}</p>
            </div>

            <div className={`rounded-xl p-5 mb-6 ${theme === 'dark' ? 'glass' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">📞</span>
                <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>
                  ستتصل بك شركتنا لتأكيد الطلب
                </p>
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                سيقوم فريقنا بالتواصل معك عبر الهاتف خلال ساعات قليلة لتأكيد طلبك وتحديد موعد التوصيل المناسب لك. شكراً لثقتك بـ {settings.storeName}!
              </p>
            </div>

            <div className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              💡 يمكنك متابعة حالة طلبك من لوحة التحكم
            </div>

            <button onClick={closeSuccess} className="w-full btn-moroccan py-4 rounded-xl text-lg">
              ✨ متابعة التسوق
            </button>
          </div>
        </div>
      )}

      {/* Cart Panel */}
      {!orderSuccess && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-full max-w-md shadow-2xl shadow-black/50 flex flex-col cart-panel ${
            theme === 'dark' ? 'bg-morocco-dark border-r border-morocco-gold/10' : 'bg-morocco-cream border-r border-morocco-gold/15'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="moroccan-border" />
          {/* Header */}
          <div className={`p-5 flex items-center justify-between ${theme === 'dark' ? 'bg-gradient-to-l from-morocco-gold/10 to-transparent' : 'bg-gradient-to-l from-morocco-gold/5 to-transparent'}`}>
            <h2 className={`text-xl font-black flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>
              <span className="text-morocco-gold">🛒</span> سلة التسوق
              <span className={`text-sm px-2 py-0.5 rounded-full ${theme === 'dark' ? 'glass-gold text-morocco-gold' : 'bg-morocco-gold/10 text-morocco-gold'}`}>{cartCount}</span>
            </h2>
            <button onClick={() => setShowCart(false)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'glass text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}>✕</button>
          </div>

          {!showCheckout ? (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 animate-float">🛒</div>
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>السلة فارغة</h3>
                    <p className={`mb-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>أضف منتجات للسلة وابدأ التسوق!</p>
                    <button onClick={() => setShowCart(false)} className="btn-moroccan px-6 py-3 rounded-xl text-sm">تسوق الآن</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className={`rounded-xl p-3 flex gap-3 hover-lift ${
                        theme === 'dark' ? 'glass' : 'bg-white border border-gray-100 shadow-sm'
                      }`}>
                        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>{item.product.name}</h4>
                          <div className="text-morocco-gold font-bold mt-1 text-sm">{item.product.price} {settings.currency}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                                theme === 'dark' ? 'glass hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}>−</button>
                            <span className={`text-sm font-bold w-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                                theme === 'dark' ? 'glass hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}>+</button>
                            <button onClick={() => removeFromCart(item.product.id)} className="mr-auto text-red-400 hover:text-red-300 transition-colors text-sm">🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className={`border-t p-5 space-y-3 ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                  <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>المجموع الفرعي</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-morocco-dark'}>{cartTotal} {settings.currency}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>الشحن</span>
                    <span>{shipping === 0 ? <span className="text-green-400 font-bold">مجاني 🎉</span> : `${shipping} ${settings.currency}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-morocco-gold">أضف {settings.freeShippingThreshold - cartTotal} {settings.currency} للشحن المجاني</p>
                  )}
                  <div className={`flex justify-between text-xl font-black pt-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={theme === 'dark' ? 'text-white' : 'text-morocco-dark'}>الإجمالي</span>
                    <span className="gradient-text">{total} {settings.currency}</span>
                  </div>
                  <button onClick={() => setShowCheckout(true)} className="w-full btn-moroccan py-4 rounded-xl text-lg">إتمام الشراء ←</button>
                  <button onClick={clearCart} className="w-full text-red-400 py-2 font-medium hover:text-red-300 transition-colors text-sm">تفريغ السلة</button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleCheckout} className="flex-1 overflow-y-auto p-5">
              <button type="button" onClick={() => setShowCheckout(false)} className="text-morocco-gold font-bold mb-4 flex items-center gap-1 text-sm">→ العودة للسلة</button>
              <h3 className={`text-xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>📝 بيانات الطلب</h3>
              <div className="space-y-4">
                <div><label className={labelClass}>الاسم الكامل *</label>
                  <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} placeholder="أدخل اسمك الكامل" /></div>
                <div><label className={labelClass}>رقم الجوال *</label>
                  <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={inputClass} placeholder="06xxxxxxxx" /></div>
                <div><label className={labelClass}>العنوان *</label>
                  <textarea required value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="المدينة، الحي، الشارع، رقم المنزل" /></div>

                <div className={`rounded-xl p-4 ${theme === 'dark' ? 'glass-gold' : 'bg-morocco-gold/10 border border-morocco-gold/20'}`}>
                  <h4 className="font-bold text-morocco-gold mb-3 text-sm">ملخص الطلب</h4>
                  {cart.map((item) => (
                    <div key={item.product.id} className={`flex justify-between text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>{item.product.name} × {item.quantity}</span>
                      <span className={theme === 'dark' ? 'text-white' : 'text-morocco-dark'}>{item.product.price * item.quantity} {settings.currency}</span>
                    </div>
                  ))}
                  <div className={`border-t mt-3 pt-3 ${theme === 'dark' ? 'border-morocco-gold/20' : 'border-morocco-gold/30'}`}>
                    <div className="flex justify-between font-black text-lg">
                      <span className={theme === 'dark' ? 'text-white' : 'text-morocco-dark'}>الإجمالي</span>
                      <span className="gradient-text">{total} {settings.currency}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors">
                  ✅ تأكيد الطلب
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;

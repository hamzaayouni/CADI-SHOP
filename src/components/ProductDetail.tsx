import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const ProductDetail: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, settings, theme } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isDark = theme === 'dark';

  if (!selectedProduct) return null;

  const discount = selectedProduct.oldPrice
    ? Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(selectedProduct);
    setAdded(true);
    setTimeout(() => { setAdded(false); setSelectedProduct(null); setQuantity(1); }, 1000);
  };


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-end sm:items-center justify-center sm:p-4" onClick={() => setSelectedProduct(null)}>
      <div className={`rounded-t-2xl sm:rounded-3xl max-w-4xl w-full sm:max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 animate-slide-up ${
        isDark ? 'glass-dark' : 'bg-white border border-gray-100'
      }`} onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[400px]">
            <img src={selectedProduct.image} alt={selectedProduct.name}
              className="w-full h-full object-cover rounded-t-2xl sm:rounded-r-3xl sm:rounded-tl-none" />
            {discount > 0 && (
              <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-l from-morocco-red to-red-700 text-white text-xs sm:text-sm font-black px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg">
                خصم {discount}%
              </span>
            )}
            <button onClick={() => setSelectedProduct(null)}
              className={`absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base ${
                isDark ? 'glass text-white hover:bg-white/20' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}>✕</button>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="text-xs sm:text-sm text-morocco-gold font-bold mb-1 sm:mb-2 tracking-wider">{selectedProduct.brand}</div>
            <h2 className={`text-lg sm:text-2xl font-black mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{selectedProduct.name}</h2>
            {selectedProduct.nameEn && <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{selectedProduct.nameEn}</p>}

            {/* Rating */}
            <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5 pb-3 sm:pb-5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="flex text-morocco-gold text-sm sm:text-xl">
                {Array.from({ length: 5 }, (_, i) => <span key={i}>{i < Math.floor(selectedProduct.rating) ? '★' : '☆'}</span>)}
              </div>
              <span className="text-morocco-gold font-bold text-xs sm:text-base">{selectedProduct.rating}</span>
              <span className={`text-[10px] sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({selectedProduct.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <span className={`text-xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{selectedProduct.price}</span>
              <span className="text-sm sm:text-lg text-morocco-gold">{settings.currency}</span>
              {selectedProduct.oldPrice && (
                <>
                  <span className={`text-sm sm:text-lg line-through ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{selectedProduct.oldPrice}</span>
                  <span className={`text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${isDark ? 'glass-gold text-morocco-gold' : 'bg-morocco-gold/10 text-morocco-terracotta'}`}>
                    وفر {selectedProduct.oldPrice - selectedProduct.price} {settings.currency}
                  </span>
                </>
              )}
            </div>

            <p className={`leading-relaxed mb-4 sm:mb-6 text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedProduct.description}</p>

            {/* Specs */}
            <div className="mb-4 sm:mb-6">
              <h4 className={`font-bold mb-2 sm:mb-3 text-xs sm:text-sm ${isDark ? 'text-white' : 'text-morocco-dark'}`}>المواصفات:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {selectedProduct.details.map((detail, index) => (
                  <div key={index} className={`flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-morocco-gold rounded-full flex-shrink-0" />{detail}
                  </div>
                ))}
              </div>
            </div>

            <div className={`text-[10px] sm:text-xs mb-4 sm:mb-6 font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>SKU: {selectedProduct.sku}</div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center rounded-lg sm:rounded-xl overflow-hidden ${isDark ? 'glass' : 'border border-gray-200'}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`px-3 sm:px-4 py-2 sm:py-3 font-bold text-base sm:text-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>−</button>
                <span className={`px-3 sm:px-5 py-2 sm:py-3 font-bold text-base sm:text-lg ${isDark ? 'text-white border-x border-white/10' : 'text-gray-700 border-x border-gray-200'}`}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 font-bold text-base sm:text-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!selectedProduct.inStock || added}
                className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition-all ${
                  added ? 'bg-green-600 text-white' : selectedProduct.inStock ? 'btn-moroccan' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}>
                {added ? '✅ تمت!' : selectedProduct.inStock ? '🛒 أضف للسلة' : 'غير متوفر'}
              </button>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${selectedProduct.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[11px] sm:text-sm font-medium ${selectedProduct.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {selectedProduct.inStock ? 'متوفر' : 'نفذ المخزون'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

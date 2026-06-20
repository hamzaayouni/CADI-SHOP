import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, settings, theme } = useStore();
  const isDark = theme === 'dark';

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className={`group rounded-xl sm:rounded-2xl overflow-hidden card-shine hover-lift product-card ${
      isDark ? 'glass-dark' : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl'
    }`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {discount > 0 && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-l from-morocco-red to-red-700 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-red-900/50">
            {discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-l from-morocco-gold to-amber-600 text-black text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-morocco-gold/30">
            ⭐
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-morocco-red/80 text-white px-3 py-1.5 rounded-lg font-black text-xs">نفذ المخزون</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-4">
        <div className="text-[10px] sm:text-xs text-morocco-gold font-bold mb-0.5 sm:mb-1 tracking-wider">{product.brand}</div>
        <h3 className={`font-bold mb-1 sm:mb-2 line-clamp-2 cursor-pointer hover:text-morocco-gold transition-colors text-xs sm:text-sm leading-relaxed card-title ${
          isDark ? 'text-white' : 'text-morocco-dark'
        }`} onClick={() => setSelectedProduct(product)}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-3">
          <div className="flex text-morocco-gold text-[10px] sm:text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? 'text-morocco-gold' : isDark ? 'text-gray-700' : 'text-gray-300'}>★</span>
            ))}
          </div>
          <span className={`text-[9px] sm:text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className={`text-base sm:text-xl font-black card-price ${isDark ? 'text-white' : 'text-morocco-dark'}`}>{product.price}</span>
          <span className="text-[10px] sm:text-sm text-morocco-gold">{settings.currency}</span>
          {product.oldPrice && (
            <span className={`text-[10px] sm:text-sm line-through card-old-price ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{product.oldPrice}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={(e) => { e.stopPropagation(); if (product.inStock) addToCart(product); }}
          disabled={!product.inStock}
          className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm transition-all ${
            product.inStock ? 'btn-moroccan' : isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}>
          {product.inStock ? '🛒 أضف للسلة' : 'غير متوفر'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

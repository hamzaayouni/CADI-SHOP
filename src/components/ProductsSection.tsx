import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

const ProductsSection: React.FC = () => {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, theme } = useStore();
  const isDark = theme === 'dark';

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      product.name.includes(searchQuery) || product.description.includes(searchQuery) ||
      product.brand.includes(searchQuery) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <section id="products" className={`py-12 sm:py-16 md:py-20 relative ${isDark ? 'bg-[#0D0D0D]' : 'bg-[#F5EFE6]'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="moroccan-divider mb-3 sm:mb-4">
            <span className="text-morocco-gold text-base sm:text-lg">◆</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>
            {currentCategory ? currentCategory.name : <span>جميع <span className="gradient-text">المنتجات</span></span>}
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg">
            {currentCategory ? currentCategory.description : 'اكتشف مجموعتنا الواسعة من المنتجات المميزة'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
          <button onClick={() => setSelectedCategory(null)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-gradient-to-l from-morocco-gold to-morocco-terracotta text-black shadow-lg shadow-morocco-gold/30'
                : isDark ? 'glass text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-morocco-dark border border-gray-200'
            }`}>الكل</button>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id ? 'bg-gradient-to-l from-morocco-gold to-morocco-terracotta text-black shadow-lg shadow-morocco-gold/30'
                  : isDark ? 'glass text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-morocco-dark border border-gray-200'
              }`}>
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>لا توجد منتجات</h3>
            <p className="text-gray-500 text-sm sm:text-base">جرب البحث بكلمات مختلفة</p>
            <button onClick={() => setSelectedCategory(null)} className="mt-4 sm:mt-6 btn-moroccan px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm">عرض الكل</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;

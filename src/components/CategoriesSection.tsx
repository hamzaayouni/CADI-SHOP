import React from 'react';
import { useStore } from '../context/StoreContext';

const CategoriesSection: React.FC = () => {
  const { categories, setSelectedCategory, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <section id="categories" className={`py-12 sm:py-16 md:py-20 zellige-pattern relative ${isDark ? 'bg-morocco-dark' : 'bg-morocco-cream'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-14">
          <div className="moroccan-divider mb-3 sm:mb-4">
            <span className="text-morocco-gold text-base sm:text-lg">◆</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-morocco-dark'}`}>
            تصفح <span className="gradient-text">الأقسام</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg">اختر القسم الذي يناسبك</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl hover-lift neon-hover"
            >
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                <img src={category.image} alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t group-hover:from-morocco-dark/90 transition-all ${
                  isDark ? 'from-black/90 via-black/40' : 'from-black/80 via-black/30'
                } to-transparent`} />
                <svg className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 text-morocco-gold/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14 8L24 0L16 10L24 12L16 14L24 24L14 16L12 24L10 16L0 24L8 14L0 12L8 10L0 0L10 8Z" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-2.5 sm:p-4 text-white">
                <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1 group-hover:scale-125 transition-transform duration-300">{category.icon}</div>
                <h3 className="font-black text-xs sm:text-sm group-hover:text-morocco-gold transition-colors leading-tight">{category.name}</h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block group-hover:text-gray-300 transition-colors">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

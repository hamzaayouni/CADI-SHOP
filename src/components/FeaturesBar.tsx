import React from 'react';
import { useStore } from '../context/StoreContext';

const FeaturesBar: React.FC = () => {
  const { features, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`border-y ${isDark ? 'bg-morocco-dark border-morocco-gold/10' : 'bg-morocco-cream border-morocco-gold/15'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2.5 sm:gap-4 group hover-lift cursor-default">
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl transition-all group-hover:scale-110 flex-shrink-0 ${
                isDark ? 'glass-gold group-hover:glow-gold' : 'bg-morocco-gold/10 border border-morocco-gold/20 group-hover:bg-morocco-gold/20'
              }`}>
                {feature.icon}
              </div>
              <div className="min-w-0">
                <div className={`font-bold text-xs sm:text-sm transition-colors truncate ${isDark ? 'text-white group-hover:text-morocco-gold' : 'text-morocco-dark group-hover:text-morocco-terracotta'}`}>
                  {feature.title}
                </div>
                <div className={`text-[10px] sm:text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesBar;

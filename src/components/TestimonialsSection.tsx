import React from 'react';
import { useStore } from '../context/StoreContext';

const TestimonialsSection: React.FC = () => {
  const { testimonials, theme } = useStore();

  return (
    <section className={`py-20 zellige-pattern relative ${theme === 'dark' ? 'bg-morocco-dark' : 'bg-morocco-cream'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="moroccan-divider mb-4">
            <span className="text-morocco-gold text-lg">◆</span>
          </div>
          <h2 className={`text-4xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>
            ماذا يقول <span className="gradient-text">عملاؤنا</span>
          </h2>
          <p className="text-gray-500 text-lg">آراء حقيقية من عملائنا السعداء</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((review, index) => (
            <div key={index} className={`rounded-2xl p-6 hover-lift group ${
              theme === 'dark' ? 'glass-dark' : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg'
            }`}>
              <div className="text-morocco-gold/30 text-5xl font-serif mb-2 leading-none">❝</div>
              <div className="flex text-morocco-gold text-lg mb-4">
                {Array.from({ length: review.rating }, (_, i) => <span key={i}>★</span>)}
              </div>
              <p className={`leading-relaxed mb-6 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                "{review.text}"
              </p>
              <div className={`flex items-center gap-3 pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                <div className="w-10 h-10 bg-gradient-to-l from-morocco-gold to-morocco-terracotta rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name[0]}
                </div>
                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-morocco-dark'}`}>{review.name}</span>
                <span className="text-xs text-morocco-gold mr-auto">عميل موثوق ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';

const Hero: React.FC = () => {
  const { heroSettings, theme } = useStore();
  const [counts, setCounts] = useState<number[]>(heroSettings.stats.map(() => 0));
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const targets = heroSettings.stats.map(s => { const n = parseInt(s.value.replace(/[^0-9]/g, '')); return isNaN(n) ? 0 : n; });
    const duration = 2000; const steps = 60; const interval = duration / steps; let step = 0;
    const timer = setInterval(() => { step++; const p = step / steps; const e = 1 - Math.pow(1 - p, 3); setCounts(targets.map(t => Math.round(t * e))); if (step >= steps) clearInterval(timer); }, interval);
    return () => clearInterval(timer);
  }, [heroSettings.stats]);

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, size: Math.random() * 2 + 1,
    delay: Math.random() * 10, duration: Math.random() * 15 + 10, opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <section className="relative min-h-[480px] sm:min-h-[560px] md:min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroSettings.backgroundImage} alt="hero" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 hero-overlay ${
          theme === 'dark' ? 'bg-gradient-to-l from-morocco-dark via-morocco-dark/95 to-morocco-dark/80'
                           : 'bg-gradient-to-l from-morocco-dark/90 via-morocco-dark/85 to-morocco-dark/70'
        }`} />
        <div className="absolute inset-0 zellige-pattern" />
      </div>

      {particles.map(p => (
        <div key={p.id} className="moroccan-particle" style={{
          left: p.left, bottom: '-10px', width: `${p.size}px`, height: `${p.size}px`,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, opacity: p.opacity,
        }} />
      ))}

      {/* Side decoration - desktop only */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 opacity-10 hidden md:block">
        <svg viewBox="0 0 200 800" className="w-full h-full" fill="none">
          <path d="M0 0 H80 V200 Q100 350 80 500 V800" stroke="#D4A843" strokeWidth="2" />
          <circle cx="90" cy="100" r="20" stroke="#D4A843" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 w-full transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 glass-gold text-morocco-gold px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold mb-5 sm:mb-8 glow-gold">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-morocco-gold rounded-full animate-pulse" />
            {heroSettings.badge}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            {heroSettings.title}
            <br />
            <span className="gradient-text text-glow-gold">{heroSettings.titleHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 sm:mb-10 leading-relaxed max-w-lg">
            {heroSettings.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2.5 sm:gap-4 mb-10 sm:mb-16">
            <a href="#products" className="btn-moroccan px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-lg inline-flex items-center gap-1.5 sm:gap-2">
              {heroSettings.primaryBtnText} <span className="text-base sm:text-xl">←</span>
            </a>
            <a href="#categories" className="glass-gold text-morocco-gold px-5 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-lg font-bold hover:bg-morocco-gold/20 transition-all border border-morocco-gold/30">
              {heroSettings.secondaryBtnText}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {heroSettings.stats.map((stat, i) => (
              <div key={i} className="text-center glass-gold rounded-lg sm:rounded-xl p-3 sm:p-4 hover-lift">
                <div className="text-xl sm:text-3xl font-black gradient-text">
                  {stat.value.startsWith('+') || stat.value.startsWith('2') ? stat.value : `+${counts[i]}`}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-sm mt-0.5 sm:mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path d="M0 50 Q360 0 720 50 Q1080 100 1440 50 V100 H0 Z" fill={theme === 'dark' ? '#0A0A0A' : '#FAF6F0'} />
        </svg>
      </div>
    </section>
  );
};

export default Hero;

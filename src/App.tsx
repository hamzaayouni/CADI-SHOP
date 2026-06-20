import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesBar from './components/FeaturesBar';
import CategoriesSection from './components/CategoriesSection';
import ProductsSection from './components/ProductsSection';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import TestimonialsSection from './components/TestimonialsSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

const StoreApp: React.FC = () => {
  const { isAdmin } = useStore();

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      {isAdmin ? (
        <AdminPanel />
      ) : (
        <>
          <Hero />
          <FeaturesBar />
          <CategoriesSection />
          <ProductsSection />
          <TestimonialsSection />
          <Footer />
        </>
      )}
      <ProductDetail />
      <Cart />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
};

export default App;

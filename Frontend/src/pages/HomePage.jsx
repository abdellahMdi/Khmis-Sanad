// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import CooperativeSpotlight from '../components/CooperativeSpotlight';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col justify-between">
      {/* Fixed Navigation Header */}
      <Header />

      {/* Main Content - pt-16 prevents overlap with fixed header */}
      <main className="pt-16 flex-1">
        <Hero />
        <CategoryGrid />
        <FeaturedProducts />
        <CooperativeSpotlight />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
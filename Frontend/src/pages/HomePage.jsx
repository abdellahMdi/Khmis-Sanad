import { useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar.jsx'
import Navbar          from '../components/Navbar.jsx'
import Hero            from '../components/Hero.jsx'
import TrustBar        from '../components/TrustBar.jsx'
import Categories      from '../components/Categories.jsx'
import ProductGrid     from '../components/ProductGrid.jsx'
import CoopsSection    from '../components/CoopsSection.jsx'
import Footer          from '../components/Footer.jsx'

export default function HomePage({ cartCount, onAddToCart, onWhatsappOrder }) {
  const [annBarVisible, setAnnBarVisible] = useState(true)

  return (
    <>
      {/* Sticky announcement bar */}
      <AnnouncementBar onClose={() => setAnnBarVisible(false)} />

      {/* Sticky navbar — shifts down by ann-bar height while it's visible */}
      <Navbar cartCount={cartCount} annBarVisible={annBarVisible} />

      {/* Page content */}
      <main className="main-wrapper">
        <Hero />
        <TrustBar />
        <Categories />
        <ProductGrid
          onAddToCart={onAddToCart}
          onWhatsappOrder={onWhatsappOrder}
        />
        <CoopsSection />
      </main>

      <Footer />
    </>
  )
}

import { useEffect, useState } from 'react'

export default function Navbar({ cartCount, annBarVisible }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      id="site-header"
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      style={{ top: annBarVisible ? 38 : 0 }}
    >
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#" className="nav-logo">
          <span style={{ fontSize: '1.5rem' }}>✋</span>
          <div>
            <div className="nav-logo-name">Khmissa Sanad</div>
            <div className="nav-logo-sub">Artisanat Marocain</div>
          </div>
        </a>

        {/* Search */}
        <div className="nav-search">
          <input
            type="text"
            placeholder="Rechercher un produit, une coopérative..."
          />
          <svg className="nav-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button className="btn-login">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Connexion
          </button>
          <button className="cart-btn">
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

const stats = [
  { value: '200+', label: 'Artisans' },
  { value: '50+',  label: 'Coopératives' },
  { value: '1200+', label: 'Produits' },
  { value: '4.9 ★', label: 'Note moyenne' },
]

export default function Hero() {
  const scrollToProducts = () => {
    document.getElementById('produits')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-pattern" />
      <div className="hero-content">
        <div className="hero-body">
          <span className="hero-eyebrow">Marketplace Artisanal</span>
          <h1 className="hero-title font-serif">
            L&rsquo;Authenticit&eacute; du<br />Terroir Marocain
          </h1>
          <p className="hero-sub">
            D&eacute;couvrez des produits uniques directement aupr&egrave;s
            des coop&eacute;ratives et artisans locaux certifi&eacute;s.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={scrollToProducts}>
              Voir les produits &darr;
            </button>
            <button className="btn-hero-outline">
              Nos coop&eacute;ratives
            </button>
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="stat-n">{s.value}</span>
              <div className="stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { coops } from '../data/coops.js'

function CoopCard({ coop }) {
  return (
    <div className="coop-card">
      <div className="coop-av">{coop.emoji}</div>
      <div className="coop-nm">{coop.name}</div>
      <div className="coop-lc">📍 {coop.location}</div>
      <div className="coop-stats">
        <div>
          <span className="coop-stat-n">{coop.products}</span>
          <div className="coop-stat-l">Produits</div>
        </div>
        <div>
          <span className="coop-stat-n">{coop.years}</span>
          <div className="coop-stat-l">Ans</div>
        </div>
        <div>
          <span className="coop-stat-n">{coop.rating}</span>
          <div className="coop-stat-l">Note</div>
        </div>
      </div>
      <button className="btn-coop">Voir la boutique &rarr;</button>
    </div>
  )
}

export default function CoopsSection() {
  return (
    <section className="coops-section">
      <span className="sec-accent">Nos Partenaires</span>
      <h2 className="sec-title">Coop&eacute;ratives Certifi&eacute;es</h2>
      <div className="coops-grid">
        {coops.map((coop) => (
          <CoopCard key={coop.id} coop={coop} />
        ))}
      </div>
    </section>
  )
}

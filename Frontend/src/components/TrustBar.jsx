const items = [
  { icon: '🚚', bg: '#F0FDF4', label: 'Livraison Partout', sub: 'Gratuite dès 200 DH' },
  { icon: '✅', bg: '#FFF7ED', label: '100% Certifié',     sub: 'Origine traçable' },
  { icon: '❤️', bg: '#FEF2F2', label: 'Impact Social',     sub: 'Achat direct artisan' },
  { icon: '📱', bg: '#F0FDF4', label: 'WhatsApp 24/7',     sub: 'Réponse sous 2h' },
]

export default function TrustBar() {
  return (
    <div className="trust-bar">
      {items.map((item) => (
        <div key={item.label} className="trust-item">
          <div className="trust-icon" style={{ background: item.bg }}>
            {item.icon}
          </div>
          <div>
            <span className="trust-label">{item.label}</span>
            <span className="trust-sub">{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

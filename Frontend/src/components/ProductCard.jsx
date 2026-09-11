const WaIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.534 5.855L.054 23.5l5.788-1.517A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.359-.214-3.72.976.993-3.624-.234-.372A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
)

const BagIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

export default function ProductCard({ product, onAddToCart, onWhatsappOrder }) {
  const { badgeColor, badge, image, emoji, coop, location, title,
          description, price, oldPrice, stars, reviews } = product

  const handleWhatsApp = () => {
    onWhatsappOrder(title, `${price} DH`, coop)
  }

  return (
    <div className="p-card">
      {/* Image / Emoji */}
      <div className="p-card-img">
        {image
          ? <img src={image} alt={title} />
          : <span className="p-card-emoji">{emoji}</span>
        }
        <span className="p-card-badge" style={{ background: badgeColor }}>
          {badge}
        </span>
      </div>

      {/* Body */}
      <div className="p-card-body">
        <div className="coop-badge">
          <span className="coop-dot" />
          {coop}
        </div>
        <div className="p-card-loc">{location}</div>
        <h3 className="p-card-title">{title}</h3>
        <p className="p-card-desc">{description}</p>

        {/* Price row */}
        <div className="p-card-price-row">
          <div>
            {oldPrice && <span className="p-card-old">{oldPrice} DH</span>}
            <span className="p-card-price">
              {price.toLocaleString('fr-FR')} <span>DH</span>
            </span>
          </div>
          <div className="p-card-stars">
            ★ {stars} <span className="cnt">({reviews} avis)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-card-btns">
          <button className="btn-add" onClick={() => onAddToCart(title)}>
            <BagIcon /> Ajouter
          </button>
          <button className="btn-wa" onClick={handleWhatsApp}>
            <WaIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

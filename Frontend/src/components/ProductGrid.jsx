import ProductCard from './ProductCard.jsx'
import { products } from '../data/products.js'

export default function ProductGrid({ onAddToCart, onWhatsappOrder }) {
  return (
    <section id="produits" className="products-section">
      {/* Header */}
      <div className="products-header">
        <div>
          <span className="sec-accent">S&eacute;lection du moment</span>
          <h2 className="sec-title">Produits Artisanaux</h2>
        </div>
        <button className="btn-view-all">Voir tout &rarr;</button>
      </div>

      {/* CIB Banner */}
      <div className="cib">
        <span className="cib-icon">🏘</span>
        <div>
          <strong className="cib-strong">
            Produits issus de 8 coop&eacute;ratives marocaines certifi&eacute;es
          </strong>
          <span className="cib-sub">
            Chaque achat soutient directement une famille d&rsquo;artisans
          </span>
        </div>
        <div className="cib-tags">
          <span className="cib-tag">🇲🇦 Made in Morocco</span>
          <span className="cib-tag">✅ AOP</span>
          <span className="cib-tag">🌿 Bio</span>
        </div>
      </div>

      {/* Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onWhatsappOrder={onWhatsappOrder}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pag-info">
          Affichage <strong>1&ndash;8</strong> sur <strong>48</strong> produits
        </span>
        <div className="pag-btns">
          <button className="pag-btn" disabled>&larr; Pr&eacute;c.</button>
          <button className="pag-btn active">1</button>
          <button className="pag-btn">2</button>
          <button className="pag-btn">3</button>
          <button className="pag-btn">Suiv. &rarr;</button>
        </div>
      </div>
    </section>
  )
}

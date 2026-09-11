import { categories } from '../data/categories.js'

export default function Categories() {
  return (
    <section className="categories-section">
      <span className="sec-accent">Parcourir</span>
      <h2 className="sec-title">Catégories</h2>
      <div className="categories-grid">
        {categories.map((cat) => (
          <button key={cat.id} className="cat-btn">
            <span className="cat-emoji">{cat.emoji}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

import { useState } from 'react'
import './MenuSection.css'

const CATEGORIES = ['All', 'Ice Cream', 'Falooda', 'Sundaes', 'Milkshakes', 'Desserts']

// Verified menu items using existing brand products and verified pricing
const MENU_ITEMS = [
  {
    id: 'shahi-falooda',
    name: 'Royal Shahi Falooda',
    category: 'Falooda',
    desc: 'Infused Damascena rose nectar, silky rabri, layered with slow-simmered vermicelli, subza basil pearls, and silver leaf.',
    price: '$14',
    badge: 'House Signature',
    image: '/icecream/strawberry.webp',
    layoutClass: 'menu-card-featured',
  },
  {
    id: 'belgian-truffle',
    name: 'Belgian Chocolate Truffle',
    category: 'Ice Cream',
    desc: '72% single-origin roasted Belgian cocoa folded into rich clotted cream with cocoa nibs and sea salt crystals.',
    price: '$12',
    badge: 'Award Winner',
    image: '/icecream/chocolate.webp',
    layoutClass: 'menu-card-tall',
  },
  {
    id: 'alphonso-gold',
    name: 'Mango Alphonso Gold',
    category: 'Sundaes',
    desc: 'Pure Ratnagiri Alphonso mango purée, vanilla bean gelato, candied mango chips, and rose vermicelli crunch.',
    price: '$16',
    badge: 'Seasonal Pick',
    image: '/icecream/mango.webp',
    layoutClass: 'menu-card-standard',
  },
  {
    id: 'kulfi-silk',
    name: 'Pistachio Kulfi Silk',
    category: 'Ice Cream',
    desc: 'Traditional clay-pot kulfi churned with hand-crushed Sicilian pistachios, cardamom foam, and botanical saffron syrup.',
    price: '$15',
    badge: 'Artisan Craft',
    image: '/icecream/pistachio.webp',
    layoutClass: 'menu-card-standard',
  },
  {
    id: 'madagascar-vanilla',
    name: 'Madagascar Bourbon Sundae',
    category: 'Sundaes',
    desc: 'Triple scoop of Bourbon vanilla bean gelato with warm golden caramel drizzle, roasted almond slivers, and wafer crisp.',
    price: '$13',
    badge: 'Classic Heritage',
    image: '/icecream/vanilla.webp',
    layoutClass: 'menu-card-standard',
  },
  {
    id: 'kesar-pista-shake',
    name: 'Kesar Pista Saffron Shake',
    category: 'Milkshakes',
    desc: 'Chilled whole cream milkshake blended with Kashmiri saffron threads and stone-ground emerald pistachios.',
    price: '$11',
    badge: 'Chilled Bliss',
    image: '/icecream/pistachio.webp',
    layoutClass: 'menu-card-wide',
  },
  {
    id: 'rose-petal-parfait',
    name: 'Rose & Berry Royal Parfait',
    category: 'Desserts',
    desc: 'Layers of strawberry compote, organic subza pearls, wild rose ice cream, and handcrafted waffle shards.',
    price: '$14',
    badge: 'Chef Creation',
    image: '/icecream/strawberry.webp',
    layoutClass: 'menu-card-wide',
  },
]

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredItems = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory)

  return (
    <section id="menu" className="menu-section" aria-label="Falooda World Menu">
      {/* Ambient background lighting */}
      <div className="menu-ambient-orb menu-orb-1" aria-hidden="true" />
      <div className="menu-ambient-orb menu-orb-2" aria-hidden="true" />

      <div className="menu-container">
        {/* ── A. Menu Introduction ─────────────────────────────────────── */}
        <div className="menu-header">
          <span className="menu-eyebrow">The Art of Indulgence</span>
          <h2 className="menu-main-title">Discover Your Next Favourite.</h2>
          <p className="menu-subtitle">
            From timeless royal classics to irresistible artisanal creations, find your perfect scoop 
            crafted with passion and heritage.
          </p>
        </div>

        {/* ── B. Category Filter Navigation ─────────────────────────────── */}
        <nav className="menu-category-nav" aria-label="Menu categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`menu-cat-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ── C. Asymmetric Product Grid ────────────────────────────────── */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className={`menu-card ${item.layoutClass || 'menu-card-standard'}`}
            >
              <div className="menu-card-media">
                <span className="menu-card-badge">{item.badge}</span>
                <span className="menu-card-price">{item.price}</span>
                <img
                  src={item.image}
                  alt={item.name}
                  className="menu-card-img"
                  loading="lazy"
                />
              </div>

              <div className="menu-card-body">
                <div className="menu-card-meta">
                  <h3 className="menu-card-name">{item.name}</h3>
                  <p className="menu-card-desc">{item.desc}</p>
                </div>

                <div className="menu-card-footer">
                  <a href="#contacts" className="menu-card-action">
                    <span>Reserve Tasting</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── D. Featured Dessert Experience ────────────────────────────── */}
        <div className="menu-featured-hero">
          <div className="menu-featured-left">
            <span className="menu-featured-tag">Exquisite Masterpiece</span>
            <h3 className="menu-featured-title">Something Extraordinary.</h3>
            <p className="menu-featured-desc">
              Experience our Royal Shahi Falooda—where wild botanical rose nectar meets slow-simmered 
              kulfi gelato, crunchy pistachios, and delicate vermicelli in pure multi-sensory harmony.
            </p>
            <a href="#contacts" className="menu-featured-btn">
              <span>Explore Dessert</span>
              <span>→</span>
            </a>
          </div>

          <div className="menu-featured-right">
            <img
              src="/icecream/chocolate.webp"
              alt="Something Extraordinary Feature Dessert"
              className="menu-featured-right-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

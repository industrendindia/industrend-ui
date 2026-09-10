import { useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, MapPin, ShieldCheck, ShoppingBag, Sparkles, Star } from 'lucide-react'

type StorefrontProps = {
  storeIndex: number
  onBack: () => void
  onAddToCart: () => void
}

const storefronts = [
  {
    name: 'Pichwai Parampara', location: 'Nathdwara, Rajasthan', craft: 'Heritage Paintings',
    hero: '/store-01-artist.jpeg',
    intro: 'Contemporary relief art shaped by Indian devotion, nature and the quiet discipline of handwork.',
    categories: [
      { name: 'Buddha Reliefs', image: '/store-01.jpeg', position: '50% 44%' },
      { name: 'Statement Art', image: '/store-01-artist.jpeg', position: '35% 45%' },
      { name: 'Festive Gifting', image: '/store-01.jpeg', position: '72% 72%' },
    ],
    products: [
      { name: 'Bodhi Leaf Buddha Relief', category: 'Buddha Reliefs', price: '₹18,500', image: '/store-01.jpeg', position: '50% 46%', favourite: true },
      { name: 'Emerald Serenity Panel', category: 'Statement Art', price: '₹21,900', image: '/store-01-artist.jpeg', position: '30% 42%', favourite: true },
      { name: 'Sacred Grove Wall Art', category: 'Buddha Reliefs', price: '₹14,800', image: '/store-01.jpeg', position: '54% 52%', favourite: false },
      { name: 'Nathdwara Celebration Edit', category: 'Festive Gifting', price: '₹9,750', image: '/store-01.jpeg', position: '82% 78%', favourite: true },
      { name: 'Meditation Corner Artwork', category: 'Statement Art', price: '₹16,200', image: '/store-01-artist.jpeg', position: '19% 43%', favourite: false },
      { name: 'Heritage Lamp & Art Set', category: 'Festive Gifting', price: '₹12,400', image: '/store-01.jpeg', position: '13% 74%', favourite: false },
    ],
  },
  {
    name: 'Mitti & More', location: 'Kutch, Gujarat', craft: 'Hand-thrown Pottery', hero: '/hero-marble-craft.jpeg',
    intro: 'Small-batch objects made slowly for tables, corners and everyday rituals.',
    categories: [
      { name: 'Vases', image: '/hero-marble-craft.jpeg', position: '50% 50%' },
      { name: 'Tableware', image: '/hero-wood-craft.jpeg', position: '50% 50%' },
      { name: 'Gifting', image: '/hero-painting-craft.jpeg', position: '50% 50%' },
    ],
    products: [
      { name: 'Kutch Earth Vase', category: 'Vases', price: '₹2,850', image: '/hero-marble-craft.jpeg', position: '50% 50%', favourite: true },
      { name: 'Desert Glaze Bowl', category: 'Tableware', price: '₹1,950', image: '/hero-wood-craft.jpeg', position: '50% 50%', favourite: false },
      { name: 'Artisan Tea Set', category: 'Gifting', price: '₹3,600', image: '/hero-painting-craft.jpeg', position: '50% 50%', favourite: true },
    ],
  },
  {
    name: 'The Loom Story', location: 'Varanasi, Uttar Pradesh', craft: 'Handwoven Textiles', hero: '/hero-painting-craft.jpeg',
    intro: 'Textiles woven with patient hands, luminous colour and generations of knowledge.',
    categories: [
      { name: 'Table Linen', image: '/hero-painting-craft.jpeg', position: '50% 50%' },
      { name: 'Cushions', image: '/hero-wood-craft.jpeg', position: '50% 50%' },
      { name: 'Collectibles', image: '/hero-marble-craft.jpeg', position: '50% 50%' },
    ],
    products: [
      { name: 'Banarasi Table Runner', category: 'Table Linen', price: '₹4,200', image: '/hero-painting-craft.jpeg', position: '50% 50%', favourite: true },
      { name: 'Zari Loom Cushion', category: 'Cushions', price: '₹2,450', image: '/hero-wood-craft.jpeg', position: '50% 50%', favourite: false },
      { name: 'Heritage Textile Panel', category: 'Collectibles', price: '₹7,800', image: '/hero-marble-craft.jpeg', position: '50% 50%', favourite: true },
    ],
  },
] as const

export default function Storefront({ storeIndex, onBack, onAddToCart }: StorefrontProps) {
  const store = storefronts[storeIndex] ?? storefronts[0]
  const [collectionFilter, setCollectionFilter] = useState('all')
  const visibleProducts = store.products.filter((product) => collectionFilter === 'all' || (collectionFilter === 'favourites' ? product.favourite : product.category === collectionFilter))

  const scrollToCollection = () => document.getElementById('store-collection')?.scrollIntoView({ behavior: 'smooth' })
  const showCollection = (filter: string) => {
    setCollectionFilter(filter)
    window.setTimeout(scrollToCollection, 0)
  }

  return (
    <main className="storefront-page" id="main">
      <button className="store-back" onClick={onBack}><ArrowLeft /> Back to all stores</button>

      <section className="storefront-hero">
        <img src={store.hero} alt={`${store.name} artisan and featured work`} />
        <div className="storefront-hero-shade" />
        <div className="storefront-hero-copy">
          <span className="storefront-kicker"><Sparkles /> Featured artisan store</span>
          <h1>{store.name}</h1>
          <p className="storefront-location"><MapPin /> {store.location} · {store.craft}</p>
          <p>{store.intro}</p>
          <button onClick={scrollToCollection}>Shop the collection <ArrowRight /></button>
        </div>
      </section>

      <section className="storefront-promises" aria-label="Store promises">
        <div><ShieldCheck /><span><b>Authenticity assured</b><small>Direct from the maker</small></span></div>
        <div><Sparkles /><span><b>Made by hand</b><small>Every piece is individual</small></span></div>
        <div><ShoppingBag /><span><b>Thoughtfully packed</b><small>Ready for safe delivery</small></span></div>
      </section>

      <section className="storefront-section">
        <div className="storefront-heading"><span>EXPLORE THE ATELIER</span><h2>Shop by <em>category.</em></h2></div>
        <div className="storefront-categories">
          {store.categories.map((category) => (
            <button key={category.name} onClick={() => showCollection(category.name)}>
              <img src={category.image} style={{ objectPosition: category.position }} alt="" />
              <span>{category.name}<ArrowRight /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="storefront-section storefront-collection" id="store-collection">
        <div className="storefront-heading row"><div><span>{collectionFilter === 'all' ? 'CURATED BY INDUS TREND' : collectionFilter.toUpperCase()}</span><h2>The store <em>collection.</em></h2></div><div><p>Objects selected for workmanship, character and a story worth carrying forward.</p>{collectionFilter !== 'all' && <button className="clear-collection-filter" onClick={() => setCollectionFilter('all')}>Show all pieces</button>}</div></div>
        <div className="storefront-products">
          {visibleProducts.map((product) => (
            <article key={product.name}>
              <div className="storefront-product-image">
                <img src={product.image} style={{ objectPosition: product.position }} alt={product.name} />
                <span>{product.category}</span>
                <button aria-label={`Save ${product.name}`}><Heart /></button>
              </div>
              <small>{store.name}</small><h3>{product.name}</h3>
              <div className="storefront-rating"><Star fill="currentColor" /> 4.9 <span>· Artisan made</span></div>
              <div className="storefront-buy"><b>{product.price}</b><button onClick={onAddToCart}>Add to bag</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="storefront-favourites">
        <div><span>CUSTOMER FAVOURITES</span><h2>Pieces people keep<br /><em>coming back to.</em></h2><p>The most-loved work from this maker, chosen for homes and meaningful gifts across India.</p><button onClick={() => showCollection('favourites')}>View favourites <ArrowRight /></button></div>
        <div className="favourites-collage">
          {store.products.filter((product) => product.favourite).slice(0, 3).map((product) => <img key={product.name} src={product.image} style={{ objectPosition: product.position }} alt={product.name} />)}
        </div>
      </section>
    </main>
  )
}

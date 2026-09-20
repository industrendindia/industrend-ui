import { useMemo, useState } from 'react'
import { ArrowLeft, ChevronDown, Heart, Minus, Plus, Search, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'

type StorefrontProps = { storeIndex: number; onBack: () => void; onAddToCart: (product: { name: string; price: number; image: string }) => void }
type Product = { id: string; name: string; category: string; price: number; mrp: number; rating: number; reviews: number; stock: number; image: string; material: string; size: string; dispatch: string; description: string }

const product = (id: string, name: string, category: string, price: number, mrp: number, rating: number, reviews: number, stock: number, material = 'Decorative handcrafted art', size = 'Display size — exact dimensions confirmed before dispatch'): Product => ({
  id, name, category, price, mrp, rating, reviews, stock, image: `/store1-product-${id}.jpg`, material, size, dispatch: category === 'Paintings' ? '2–4 business days' : '3–6 business days', description: category === 'Paintings' ? 'A richly detailed artwork presented in a warm artisan-studio setting. Designed as a premium statement piece for living rooms, pooja spaces and meaningful gifting.' : 'A handcrafted devotional piece created with expressive colour and fine decorative detail for pooja spaces, festive display and meaningful gifting.'
})

const rahulProducts: Product[] = [
  product('krishna-radha', 'Krishna & Radha Devotional Artwork', 'Paintings', 4999, 5999, 4.9, 128, 7, 'Mixed-media fine art', '24 × 30 in'),
  product('shivaji', 'Chhatrapati Shivaji Maharaj Portrait', 'Paintings', 5499, 6499, 4.8, 94, 5, 'Fine-art print with handcrafted finish', '24 × 30 in'),
  product('ganesh-royal-seated', 'Royal Seated Ganesh Idol', 'Ganesh Idols', 7499, 8499, 4.9, 42, 3),
  product('ganesh-turquoise-orange', 'Traditional Turquoise & Orange Ganesh Idol', 'Ganesh Idols', 6499, 7499, 4.8, 37, 4),
  product('ganesh-regal-lotus', 'Regal Lotus Ganesh Idol', 'Ganesh Idols', 8999, 9999, 4.9, 31, 2),
  product('ganesh-pink-lotus', 'Pink Lotus Ganesh Idol', 'Ganesh Idols', 6999, 7999, 4.8, 28, 5),
  product('ganesh-purple-royal-seated', 'Royal Purple Seated Ganesh Idol', 'Ganesh Idols', 7299, 8299, 4.8, 19, 3),
  product('ganesh-jewel-crown', 'Jewel Crown Ganesh Idol', 'Ganesh Idols', 5999, 6999, 4.8, 17, 4),
  product('ganesh-pink-dhoti', 'Pink Dhoti Ganesh Idol', 'Ganesh Idols', 6799, 7799, 4.9, 21, 3),
  product('ganesh-golden-four-arm', 'Golden Four-Arm Ganesh Idol', 'Ganesh Idols', 6199, 7199, 4.8, 15, 4),
  product('ganesh-green-dhoti', 'Green Dhoti Ganesh Idol', 'Ganesh Idols', 5899, 6899, 4.8, 18, 5),
  product('ganesh-pink-lotus-pearl', 'Pearl Lotus Ganesh Idol', 'Ganesh Idols', 6399, 7399, 4.9, 16, 3),
  product('ganesh-orange-pink-lotus', 'Orange & Pink Lotus Ganesh Idol', 'Ganesh Idols', 5699, 6699, 4.7, 14, 4),
  product('ganesh-pink-traditional', 'Traditional Pink Ganesh Idol', 'Ganesh Idols', 4999, 5999, 4.7, 13, 6),
]

const fallbackProducts: Product[] = [product('krishna-radha', 'Artisan Collection', 'All Products', 2850, 3200, 4.8, 24, 6)]
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

export default function Storefront({ storeIndex, onBack, onAddToCart }: StorefrontProps) {
  const isRahul = storeIndex === 0
  const products = isRahul ? rahulProducts : fallbackProducts
  const storeName = isRahul ? 'Rahul Sawant' : 'Mitti & More'
  const [category, setCategory] = useState('All Products')
  const [categorySearch, setCategorySearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [selected, setSelected] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState<string[]>([])

  const categories = useMemo(() => ['All Products', ...Array.from(new Set(products.map((item) => item.category).filter((item) => item !== 'All Products')))], [products])
  const filteredCategories = categories.filter((item) => item.toLowerCase().includes(categorySearch.toLowerCase()))
  const visibleProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()
    const result = products.filter((item) => (category === 'All Products' || item.category === category) && (!query || `${item.name} ${item.category}`.toLowerCase().includes(query)))
    return [...result].sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : sort === 'name' ? a.name.localeCompare(b.name) : 0)
  }, [products, category, productSearch, sort])

  const chooseCategory = (next: string) => { setCategory(next); setProductSearch('') }
  const openProduct = (item: Product) => { setSelected(item); setQuantity(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const add = (item: Product) => onAddToCart({ name: item.name, price: item.price, image: item.image })

  if (selected) return (
    <main className="product-detail-page" id="main">
      <button className="store-back detail-back" onClick={() => setSelected(null)}><ArrowLeft /> Back to catalogue</button>
      <div className="product-detail-layout">
        <div className="product-detail-media"><img src={selected.image} alt={selected.name} /></div>
        <section className="product-detail-copy">
          <span className="catalogue-eyebrow">{storeName} · {selected.category}</span>
          <h1>{selected.name}</h1>
          <div className="detail-rating"><span>★★★★★</span> {selected.rating} · {selected.reviews} reviews</div>
          <div className="detail-price"><strong>{money(selected.price)}</strong><del>{money(selected.mrp)}</del><b>Save {Math.round((1 - selected.price / selected.mrp) * 100)}%</b></div>
          <p>{selected.description}</p>
          <div className="detail-facts"><div><b>Material</b><span>{selected.material}</span></div><div><b>Size</b><span>{selected.size}</span></div><div><b>Dispatch</b><span>{selected.dispatch}</span></div><div><b>Returns</b><span>7-day return on eligible condition</span></div></div>
          <small>Made / curated in Pune, Maharashtra · {selected.stock} units available</small>
          <div className="quantity-row"><b>Quantity</b><div><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => Math.min(selected.stock, value + 1))}><Plus /></button></div><small>{selected.stock} in stock</small></div>
          <div className="detail-actions"><button onClick={() => add(selected)}>Add to Cart</button><button onClick={() => add(selected)}>Buy Now</button></div>
          <div className="detail-seller">Sold by <b>{storeName}</b> · Verified seller on Indus Trend</div>
        </section>
      </div>
    </main>
  )

  return (
    <main className="catalogue-page" id="main">
      <button className="store-back" onClick={onBack}><ArrowLeft /> Back to all stores</button>
      <section className="catalogue-banner">
        <img src={isRahul ? '/store-01-artist.jpeg' : '/hero-marble-craft.jpeg'} alt={`${storeName} artisan studio`} />
        <div><span className="storefront-kicker"><Sparkles /> Featured artisan store</span><h1>{storeName}</h1><p>{isRahul ? 'Paintings • Ganesh Idols • Name Plates • Wall Art' : 'Hand-thrown pottery and thoughtful objects'}</p></div>
      </section>
      <section className="catalogue-promises"><div><ShieldCheck /> Authenticity assured</div><div><Sparkles /> Made by hand</div><div><ShoppingBag /> Thoughtfully packed</div></section>
      <section className="catalogue-section">
        <div className="catalogue-heading"><span>STORE COLLECTION</span><h2>Explore the <em>catalogue.</em></h2><p>Browse every piece, narrow the collection by category, or search for something specific.</p></div>
        <div className="category-strip" aria-label="Product categories">
          {categories.map((item) => { const sample = products.find((entry) => item === 'All Products' || entry.category === item) ?? products[0]; return <button key={item} className={category === item ? 'active' : ''} onClick={() => chooseCategory(item)}><img src={sample.image} alt="" /><span><b>{item}</b><small>{item === 'All Products' ? products.length : products.filter((entry) => entry.category === item).length} products</small></span></button> })}
        </div>
        <div className="catalogue-layout">
          <aside className="catalogue-filter">
            <span className="catalogue-eyebrow">Filter catalogue</span><h3>Product Categories</h3>
            <label><Search /><input value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} placeholder="Search categories..." /></label>
            <div>{filteredCategories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => chooseCategory(item)}><span>{item}</span><small>{item === 'All Products' ? products.length : products.filter((entry) => entry.category === item).length}</small></button>)}</div>
          </aside>
          <div className="catalogue-results">
            <div className="catalogue-toolbar">
              <label><Search /><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search products in this store..." /></label>
              <label className="mobile-category"><select value={category} onChange={(event) => chooseCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></label>
              <label><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Top Rated</option><option value="name">Name A–Z</option></select><ChevronDown /></label>
            </div>
            <div className="catalogue-result-head"><div><h3>{category}</h3><p>{visibleProducts.length} pieces from {storeName}</p></div>{(category !== 'All Products' || productSearch) && <button onClick={() => { setCategory('All Products'); setProductSearch('') }}>Clear filters</button>}</div>
            <div className="catalogue-grid">
              {visibleProducts.map((item) => <article className="catalogue-card" key={item.id}>
                <div className="catalogue-card-media"><img src={item.image} alt={item.name} /><span>{item.category}</span><button className={saved.includes(item.id) ? 'saved' : ''} onClick={() => setSaved((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} aria-label={`Save ${item.name}`}><Heart fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
                <div className="catalogue-card-body"><small>{storeName}</small><h3>{item.name}</h3><div className="catalogue-rating"><span>★★★★★</span> {item.rating} ({item.reviews})</div><div className="catalogue-price"><strong>{money(item.price)}</strong><del>{money(item.mrp)}</del></div><p>In stock · Dispatch {item.dispatch}</p><div className="catalogue-card-actions"><button onClick={() => add(item)}>Add to Cart</button><button onClick={() => openProduct(item)} aria-label={`View ${item.name} details`}><Search /></button></div></div>
              </article>)}
              {!visibleProducts.length && <div className="catalogue-empty"><Search /><h3>No products found</h3><p>Try another category or clear your search.</p><button onClick={() => { setCategory('All Products'); setProductSearch('') }}>Show all products</button></div>}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { ArrowRight, Camera, ChevronRight, Heart, Mail, MapPin, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react'

const navItems = [
  ['Home', 'home'],
  ['Stores', 'stores'],
  ['Our Products', 'products'],
  ['About Us', 'about'],
  ['Contact', 'contact'],
] as const

const stores = [
  { name: 'Pichwai Parampara', place: 'Nathdwara, Rajasthan', craft: 'Heritage Paintings', image: 'store-pichwai' },
  { name: 'Mitti & More', place: 'Kutch, Gujarat', craft: 'Hand-thrown Pottery', image: 'store-pottery' },
  { name: 'The Loom Story', place: 'Varanasi, Uttar Pradesh', craft: 'Handwoven Textiles', image: 'store-textile' },
] as const

const products = [
  { name: 'The Monsoon Pichwai', maker: 'By Pichwai Parampara', price: '₹18,500', tag: 'ONE OF ONE', tone: 'painting' },
  { name: 'Kutch Earth Vase', maker: 'By Mitti & More', price: '₹2,850', tag: 'SMALL BATCH', tone: 'vase' },
  { name: 'Banarasi Table Runner', maker: 'By The Loom Story', price: '₹4,200', tag: 'HANDWOVEN', tone: 'textile' },
  { name: 'Dhokra Forest Horse', maker: 'By Bastar Foundry', price: '₹6,750', tag: 'COLLECTOR EDITION', tone: 'brass' },
] as const

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const toggleSaved = (name: string) => {
    setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement">Complimentary shipping across India on orders above ₹2,500 <span>•</span> Every purchase supports an artisan</div>

      <header className="header" aria-label="Main navigation">
        <button className="icon-btn menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
        <button className="brand" onClick={() => goTo('home')} aria-label="Indus Trend home">
          <img src="/industrend-logo.jpg" alt="Indus Trend" />
          <span className="brand-copy"><strong>INDUS TREND</strong><small>AUTHENTIC BHARAT LIFESTYLE PLATFORM</small></span>
        </button>
        <nav className="desktop-nav">
          {navItems.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button className="login-link" onClick={() => alert('Login will be connected to the secure backend service soon.')}>Login</button>
          <button className="icon-btn search-btn" aria-label="Search"><Search /></button>
          <button className="bag-btn" aria-label="Shopping bag"><ShoppingBag /><span>0</span></button>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="icon-btn drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
        <img src="/industrend-logo.jpg" alt="" />
        <nav>{navItems.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}<ChevronRight /></button>)}</nav>
        <button className="drawer-login" onClick={() => alert('Login will be connected soon.')}>Login to your account</button>
      </div>
      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <main id="main">
        <section className="hero" id="home">
          <img className="hero-image" src="/hero-artisan.png" alt="Curated Indian painting, pottery, textile and brass craft" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="eyebrow"><span /> CURATED FROM THE HEART OF INDIA</div>
            <h1>Rare craft.<br /><em>Remarkable stories.</em></h1>
            <p>Discover pieces you won’t find everywhere—made slowly, held dearly, and shared with you by India’s most devoted makers.</p>
            <div className="hero-ctas">
              <button className="primary-btn" onClick={() => goTo('products')}>Explore the collection <ArrowRight /></button>
              <button className="text-btn light" onClick={() => goTo('stores')}>Meet our makers <span>↗</span></button>
            </div>
          </div>
          <div className="hero-note"><Sparkles /><span><b>Crafted, not manufactured</b><small>Every piece carries the hand of its maker</small></span></div>
        </section>

        <section className="trust-strip" aria-label="Our promises">
          <div><b>01</b><span><strong>Authentic by origin</strong><small>Sourced directly from makers</small></span></div>
          <div><b>02</b><span><strong>Limited by nature</strong><small>Rare pieces, never mass-produced</small></span></div>
          <div><b>03</b><span><strong>Ethical at heart</strong><small>Fair value for every artisan</small></span></div>
          <div><b>04</b><span><strong>Made to be kept</strong><small>Quality that becomes legacy</small></span></div>
        </section>

        <section className="section stores-section" id="stores">
          <div className="section-heading split-heading">
            <div><span className="kicker">THE PEOPLE BEHIND THE PIECES</span><h2>Stores with a <em>soul.</em></h2></div>
            <div><p>Independent ateliers. Generational workshops. Quiet corners of India where extraordinary things are still made by hand.</p><button className="text-btn" onClick={() => alert('The full stores directory is coming soon.')}>View all stores <ArrowRight /></button></div>
          </div>
          <div className="store-grid">
            {stores.map((store, index) => (
              <article className="store-card" key={store.name}>
                <div className={`store-art ${store.image}`}><span className="store-number">0{index + 1}</span><div className="craft-object" /></div>
                <div className="store-meta"><div><span>{store.craft}</span><h3>{store.name}</h3><p><MapPin /> {store.place}</p></div><button aria-label={`View ${store.name}`}><ArrowRight /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section products-section" id="products">
          <div className="section-heading centered"><span className="kicker">OBJECTS OF MEANING</span><h2>Chosen for their <em>story.</em></h2><p>A considered edit of objects made with patience, purpose and a point of view.</p></div>
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className={`product-art product-${product.tone}`}><span>{product.tag}</span><button className={saved.includes(product.name) ? 'saved' : ''} onClick={() => toggleSaved(product.name)} aria-label={`Save ${product.name}`}><Heart fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button><div className="product-object" /></div>
                <div className="product-info"><div><small>{product.maker}</small><h3>{product.name}</h3></div><strong>{product.price}</strong></div>
              </article>
            ))}
          </div>
          <button className="outline-btn" onClick={() => alert('More products will arrive with the commerce experience.')}>Discover all products <ArrowRight /></button>
        </section>

        <section className="story-section" id="about">
          <div className="story-pattern"><div className="story-medallion"><img src="/industrend-logo.jpg" alt="Indus Trend seal" /></div></div>
          <div className="story-copy"><span className="kicker">OUR NORTH STAR</span><h2>Not just made in India.<br /><em>Made of India.</em></h2><p>Indus Trend is a bridge between exceptional Indian makers and people around the world who value what is real, rare and responsibly made.</p><p>We seek out work with a distinct voice—objects rooted in place, carried by tradition, and alive with the character of the hands that shaped them.</p><button className="text-btn light" onClick={() => alert('Our complete story is coming soon.')}>Read our story <ArrowRight /></button></div>
        </section>

        <section className="newsletter" id="contact">
          <span className="kicker">LET THE RARE FIND YOU</span><h2>Stories, makers and first looks—<br /><em>sent thoughtfully.</em></h2>
          <form onSubmit={(event) => { event.preventDefault(); alert('Thank you. You’re on the list!') }}><label className="sr-only" htmlFor="email">Email address</label><Mail /><input id="email" type="email" required placeholder="Your email address" /><button type="submit">Join the circle <ArrowRight /></button></form>
          <p>No noise. Just beautiful things worth knowing.</p>
        </section>
      </main>

      <footer>
        <div className="footer-main"><div className="footer-brand"><img src="/industrend-logo.jpg" alt="" /><div><strong>INDUS TREND</strong><p>Authentic Bharat lifestyle, thoughtfully curated for the world.</p></div></div><div><b>EXPLORE</b><button onClick={() => goTo('stores')}>Our stores</button><button onClick={() => goTo('products')}>Products</button><button onClick={() => goTo('about')}>Our story</button></div><div><b>SUPPORT</b><a href="mailto:hello@industrend.in">Contact us</a><button onClick={() => alert('Shipping information is coming soon.')}>Shipping</button><button onClick={() => alert('Returns information is coming soon.')}>Returns</button></div><div><b>CONNECT</b><a href="mailto:hello@industrend.in">hello@industrend.in</a><a href="#" aria-label="Instagram"><Camera /> Instagram</a></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Indus Trend. All rights reserved.</span><span>Authentic • Ethical • Exceptional</span></div>
      </footer>
    </div>
  )
}

export default App

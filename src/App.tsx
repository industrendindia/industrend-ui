import { useEffect, useState } from 'react'
import { ArrowRight, Camera, ChevronDown, ChevronRight, Globe2, Heart, Mail, MapPin, Menu, MessageCircle, Phone, Search, ShoppingBag, Sparkles, X } from 'lucide-react'

const navItems = [
  ['Home', 'home'],
  ['Stores', 'stores'],
  ['Our Products', 'products'],
  ['About Us', 'about'],
  ['Contact Us', 'contact'],
] as const

const indianLanguages = [
  ['en', 'English'], ['as', 'অসমীয়া'], ['bn', 'বাংলা'], ['brx', 'बड़ो'], ['doi', 'डोगरी'],
  ['gu', 'ગુજરાતી'], ['hi', 'हिन्दी'], ['kn', 'ಕನ್ನಡ'], ['ks', 'کٲشُر'], ['kok', 'कोंकणी'], ['mai', 'मैथिली'],
  ['ml', 'മലയാളം'], ['mni-Mtei', 'ꯃꯤꯇꯩꯂꯣꯂ'], ['mr', 'मराठी'], ['ne', 'नेपाली'], ['or', 'ଓଡ଼ିଆ'], ['pa', 'ਪੰਜਾਬੀ'],
  ['sa', 'संस्कृतम्'], ['sat', 'ᱥᱟᱱᱛᱟᱲᱤ'], ['sd', 'سنڌي'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'], ['ur', 'اردو'],
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

declare global {
  interface Window {
    google?: { translate: { TranslateElement: new (options: object, elementId: string) => void } }
    googleTranslateElementInit?: () => void
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setSelectedLanguage(window.localStorage.getItem('indus-language') || 'en')
    window.googleTranslateElementInit = () => {
      if (!window.google || document.querySelector('#google_translate_element select')) return
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: indianLanguages.map(([code]) => code).filter((code) => code !== 'en').join(','), autoDisplay: false }, 'google_translate_element')
    }
    if (window.google?.translate) window.googleTranslateElementInit()
    else if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const toggleSaved = (name: string) => {
    setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])
  }

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language)
    window.localStorage.setItem('indus-language', language)
    if (language === 'en') {
      document.cookie = 'googtrans=/en/en; path=/'
      window.location.reload()
      return
    }
    let attempts = 0
    const applyTranslation = () => {
      const translator = document.querySelector<HTMLSelectElement>('#google_translate_element select')
      if (translator) {
        translator.value = language
        translator.dispatchEvent(new Event('change', { bubbles: true }))
      } else if (attempts++ < 20) window.setTimeout(applyTranslation, 250)
    }
    applyTranslation()
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
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
          <label className="language-picker" aria-label="Choose website language"><Globe2 /><span className="sr-only">Language</span><select value={selectedLanguage} onChange={(event) => changeLanguage(event.target.value)}>{indianLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select><ChevronDown /></label>
          <button className="login-link" onClick={() => alert('Login will be connected to the secure backend service soon.')}>Login</button>
          <button className="icon-btn search-btn" aria-label="Search"><Search /></button>
          <button className="bag-btn" aria-label="Shopping bag"><ShoppingBag /><span>0</span></button>
        </div>
      </header>

      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="icon-btn drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
        <img src="/industrend-logo.jpg" alt="" />
        <nav>{navItems.map(([label, id]) => <button key={id} onClick={() => goTo(id)}>{label}<ChevronRight /></button>)}</nav>
        <label className="drawer-language"><Globe2 /><span>Website language</span><select value={selectedLanguage} onChange={(event) => changeLanguage(event.target.value)}>{indianLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        <button className="drawer-login" onClick={() => alert('Login will be connected soon.')}>Login to your account</button>
      </div>
      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <main id="main">
        <section className="hero" id="home">
          <img className="hero-image" src="/hero-artisan.webp" alt="Curated Indian painting, pottery, textile and brass craft" />
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

        <section className="contact-section" id="contact">
          <div className="contact-copy"><span className="kicker">WE’D LOVE TO HEAR FROM YOU</span><h2>Contact <em>Us.</em></h2><p>Questions about a piece, a maker, or your order? Our team is here to help.</p>
            <address>
              <a href="https://www.google.com/maps/search/?api=1&query=Leon+Orbit+B+Wing+Kokane+Chowk+Rahatani+Pune+411017" target="_blank" rel="noreferrer"><span><MapPin /></span><div><b>Visit our studio</b><small>Leon Orbit, B Wing, Kokane Chowk,<br />Rahatani, Pune – 411017</small></div><ArrowRight /></a>
              <a href="tel:+919356419345"><span><Phone /></span><div><b>Call or WhatsApp</b><small>+91 93564 19345</small></div><ArrowRight /></a>
              <a href="mailto:industrendapp@gmail.com"><span><Mail /></span><div><b>Email us</b><small>industrendapp@gmail.com</small></div><ArrowRight /></a>
            </address>
          </div>
          <div className="map-wrap"><iframe title="Indus Trend location at Leon Orbit, Rahatani, Pune" src="https://www.google.com/maps?q=Leon%20Orbit%20B%20Wing%20Kokane%20Chowk%20Rahatani%20Pune%20411017&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href="https://www.google.com/maps/dir/?api=1&destination=Leon+Orbit+B+Wing+Kokane+Chowk+Rahatani+Pune+411017" target="_blank" rel="noreferrer">Get directions <ArrowRight /></a></div>
        </section>
      </main>

      <footer>
        <div className="footer-main"><div className="footer-brand"><img src="/industrend-logo.jpg" alt="" /><div><strong>INDUS TREND</strong><p>Authentic Bharat lifestyle, thoughtfully curated for the world.</p></div></div><div><b>EXPLORE</b><button onClick={() => goTo('stores')}>Our stores</button><button onClick={() => goTo('products')}>Products</button><button onClick={() => goTo('about')}>Our story</button></div><div><b>SUPPORT</b><a href="mailto:industrendapp@gmail.com">Contact us</a><button onClick={() => alert('Shipping information is coming soon.')}>Shipping</button><button onClick={() => alert('Returns information is coming soon.')}>Returns</button></div><div><b>CONNECT</b><a href="mailto:industrendapp@gmail.com">industrendapp@gmail.com</a><a href="#" aria-label="Instagram"><Camera /> Instagram</a></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Indus Trend. All rights reserved.</span><span>Powered by Repair Hub Billing Solution</span></div>
      </footer>
      <a className="whatsapp-float" href="https://wa.me/919356419345?text=Hello%20Indus%20Trend%2C%20I%20would%20like%20to%20know%20more." target="_blank" rel="noreferrer" aria-label="Chat with Indus Trend on WhatsApp"><MessageCircle /><span>Chat with us</span></a>
      <div id="google_translate_element" className="google-translate-engine" aria-hidden="true" />
    </div>
  )
}

export default App
